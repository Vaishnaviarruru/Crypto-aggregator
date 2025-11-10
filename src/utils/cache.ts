// temporary no-cache version (for testing without Redis)
export async function getCached<T>(_key: string): Promise<T | null> {
  return null;
}

export async function setCached(_key: string, _value: unknown) {
  return;
}
