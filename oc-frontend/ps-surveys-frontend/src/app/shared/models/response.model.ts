export class Rspn<T> {
    constructor(
        public readonly success: boolean,
        public readonly data: T,
        public readonly error?: string
    ) { }
}

export class Doc<T> {
  constructor(public id: string, public doc: T) { }
}
