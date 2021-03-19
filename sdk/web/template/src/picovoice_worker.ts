/*
    Copyright 2021 Picovoice Inc.

    You may not use this file except in compliance with the license. A copy of the license is located in the "LICENSE"
    file accompanying this source.

    Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
    an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
    specific language governing permissions and limitations under the License.
*/

import { Picovoice } from './picovoice';
import {
  PicovoiceEngineArgs,
  PicovoiceWorkerArgs,
  PicovoiceWorkerRequestInit,
  PicovoiceWorkerResponseErrorInit,
  PicovoiceWorkerResponseReady,
  PorcupineWorkerResponseKeyword,
  RhinoInference,
  RhinoWorkerResponseInference,
  WorkerRequestProcess,
  WorkerRequestVoid,
} from './picovoice_types';

let picovoice: Picovoice;
let paused: boolean;
let ready: boolean;

function porcupineCallback(keywordLabel: string): void {
  const ppnKeywordResponse: PorcupineWorkerResponseKeyword = {
    command: 'ppn-keyword',
    keywordLabel: keywordLabel
  };
  postMessage(ppnKeywordResponse, undefined);
}

function rhinoCallback(inference: RhinoInference): void {
  const rhnInferenceResponse: RhinoWorkerResponseInference = {
    command: 'rhn-inference',
    inference: inference
  };
  postMessage(rhnInferenceResponse, undefined);
}

async function init(pvWorkerArgs: PicovoiceWorkerArgs): Promise<void> {
  paused = !pvWorkerArgs.start ?? false;
  const pvEngineArgs: PicovoiceEngineArgs = {
    ...pvWorkerArgs,
    porcupineCallback: porcupineCallback,
    rhinoCallback: rhinoCallback
  }
  ready = false;
  try {
    picovoice = await Picovoice.create(pvEngineArgs)
  } catch (error) {
    const pvInitErrorMessage: PicovoiceWorkerResponseErrorInit = {
      command: 'pv-error-init',
      error: error
    };
    postMessage(pvInitErrorMessage, undefined);
    return;
  }

  const pvReadyMessage: PicovoiceWorkerResponseReady = {
    command: 'pv-ready',
  };
  postMessage(pvReadyMessage, undefined);
  ready = true;
}

function process(inputFrame: Int16Array): void {
  if (!paused && ready) {
    picovoice.process(inputFrame)
  }
}

function release(): void {
  ready = false
  picovoice.release()
  close();
}

onmessage = function (
  event: MessageEvent<
    WorkerRequestVoid | WorkerRequestProcess | PicovoiceWorkerRequestInit
  >
): void {
  switch (event.data.command) {
    case 'init':
      init(event.data.picovoiceArgs);
      break;
    case 'process':
      process(event.data.inputFrame);
      break;
    case 'pause':
      paused = true;
      break;
    case 'resume':
      paused = false;
      break;
    case 'release':
      release();
      break;
    default:
      // eslint-disable-next-line no-console
      console.warn(
        'Unhandled command in picovoice_worker: ' + event.data.command
      );
  }
};