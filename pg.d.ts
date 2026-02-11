
// Define tipagens mínimas do módulo "pg" para manter segurança de tipos sem depender de @types/pg.
declare module "pg" {
  // Representa um valor válido para parâmetros SQL parametrizados.
  export type QueryParam = string | number | boolean | null | string[];

  // Define a configuração base usada ao criar o Pool de conexões.
  export interface PoolConfig {
    connectionString?: string;
    ssl?: { rejectUnauthorized?: boolean } | boolean;
  }

  // Modela o formato da resposta de uma query com linhas tipadas.
  export interface QueryResult<Row = unknown> {
    rows: Row[];
    rowCount: number;
  }

  // Define o contrato mínimo do Pool necessário neste projeto.
  export class Pool {
    constructor(config?: PoolConfig);
    query<Row = unknown>(
      text: string,
      params?: QueryParam[]
    ): Promise<QueryResult<Row>>;
  }
}
