import { Callback } from '../types';

export type DisposerLike = Callback<void>;

export class Disposable {
  private _bag: DisposerLike[] = [];

  public autoDispose = (disposer: DisposerLike): void => {
    this._bag.push(disposer);
  };

  public dispose = (): void => {
    this._bag.forEach((disposer) => disposer());
    this._bag = [];
  };
}
