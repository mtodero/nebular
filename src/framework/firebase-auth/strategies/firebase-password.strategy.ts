/*
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Injectable } from '@angular/core';
import { NbAuthStrategy } from '../../auth/strategies/auth-strategy';
import { NbAuthResult } from '../../auth/services/auth-result';
import { Observable, of as observableOf } from 'rxjs';
import { NbAuthStrategyClass } from '../../auth/auth.options';
import { HttpClient } from '@angular/common/http';
import {
  firebasePasswordStrategyOptions,
  NbFirebasePasswordStrategyOptions
} from './firebase-password-strategy.options';
import { NbAuthStrategyOptions } from '../../auth/strategies/auth-strategy-options';
import { AngularFireAuth } from '@angular/fire/auth';
import { fromPromise } from 'rxjs/internal-compatibility';
import { catchError, map, switchMap} from 'rxjs/operators';
import UserCredential = firebase.auth.UserCredential;


@Injectable()
export class NbFirebasePasswordStrategy extends NbAuthStrategy {

  protected defaultOptions: NbFirebasePasswordStrategyOptions = firebasePasswordStrategyOptions;

  static setup(options: NbFirebasePasswordStrategyOptions): [NbAuthStrategyClass, NbAuthStrategyOptions] {
    return [NbFirebasePasswordStrategy, options];
  }

  constructor(
    protected http: HttpClient,
    protected afAuth: AngularFireAuth
  ) {
    super();
  }

  authenticate({ email, password }: any): Observable<NbAuthResult> {
    return fromPromise(this.afAuth.signInWithEmailAndPassword(email, password))
      .pipe(
        switchMap((res) => this.processSuccess(res, 'login')),
        catchError((error) => this.proccessFailure(error, 'login')),
      );
  }

  logout(): Observable<NbAuthResult> {
    const module = 'logout';
    return fromPromise(this.afAuth.signOut())
      .pipe(
        map(() => {
          return new NbAuthResult(
            true,
            null,
            this.getOption(`${module}.redirect.success`),
            [],
            this.getOption('logout.defaultMessages'),
          )
        }),
        catchError((error) => this.proccessFailure(error, module)),
      );
  }

  refreshToken(data?: any): Observable<NbAuthResult> {
    return undefined;
  }

  register({ email, password }: any): Observable<NbAuthResult> {
    const module = 'register';
    return fromPromise(this.afAuth.createUserWithEmailAndPassword(email, password))
      .pipe(
        switchMap((res) => this.processSuccess(res, module)),
        catchError((error) => this.proccessFailure(error, module)),
      );
  }

  requestPassword(data?: any): Observable<NbAuthResult> {
    return undefined;
  }

  resetPassword(data?: any): Observable<NbAuthResult> {
    return undefined;
  }

  private proccessFailure(error: any, module: string): Observable<NbAuthResult> {
    return observableOf(new NbAuthResult(
      false,
      error,
      this.getOption(`${module}.redirect.fail`),
      this.getOption('errors.getter')(module, error, this.options),
    ));
  }

  private processSuccess(res: UserCredential, module: string): Observable<NbAuthResult> {
    return this.afAuth.idToken
      .pipe(map(token => {
        return new NbAuthResult(
          true,
          res,
          this.getOption(`${module}.redirect.success`),
          [],
          this.getOption('messages.getter')(module, res, this.options),
          this.createToken(token),
        );
      }));
  }
}
