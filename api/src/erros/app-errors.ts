// src/errors/app-errors.ts
export class NotFoundError extends Error {
  constructor(message = "Registro não encontrado.") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends Error {
  constructor(message = "Registro já existe.") {
    super(message);
    this.name = "ConflictError";
  }
}
