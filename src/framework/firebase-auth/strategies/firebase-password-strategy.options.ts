/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { NbAuthStrategyOptions } from '../../auth/strategies/auth-strategy-options';
import { getDeepFromObject } from '../../auth/helpers';
import { NbPasswordStrategyMessage } from '../../auth/strategies/password/password-strategy-options';

export interface NbFirebasePasswordStrategyModule {
  redirect?: {
    success?: string | null;
    failure?: string | null;
  };
  defaultErrors?: string[],
  defaultMessages?: string[],
}

export class NbFirebasePasswordStrategyOptions extends NbAuthStrategyOptions {
  register?: boolean | NbFirebasePasswordStrategyModule = {
    redirect: {
      success: '/',
      failure: null,
    },
    defaultErrors: ['Something went wrong, please try again.'],
    defaultMessages: ['You have been successfully registered.'],
  };
  login?: boolean | NbFirebasePasswordStrategyModule = {
    redirect: {
      success: '/',
      failure: null,
    },
    defaultErrors: ['Login/Email combination is not correct, please try again.'],
    defaultMessages: ['You have been successfully logged in.'],
  };
  logout? = {
    redirect: {
      success: '/',
      failure: null,
    },
    defaultErrors: ['Something went wrong, please try again.'],
    defaultMessages: ['You have been successfully logged out.'],
  };
  errors?: NbPasswordStrategyMessage = {
    key: 'message',
    getter: (module: string, res, options: NbFirebasePasswordStrategyOptions) => getDeepFromObject(
      res,
      options.errors.key,
      options[module].defaultErrors,
    ),
  };
  messages?: NbPasswordStrategyMessage = {
    key: 'messages',
    getter: (module: string, res, options: NbFirebasePasswordStrategyOptions) => getDeepFromObject(
      res.body,
      options.messages.key,
      options[module].defaultMessages,
    ),
  };
}

export const firebasePasswordStrategyOptions: NbFirebasePasswordStrategyOptions = new NbFirebasePasswordStrategyOptions();
