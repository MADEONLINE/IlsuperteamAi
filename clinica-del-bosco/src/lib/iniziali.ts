/** Iniziali di un nome per i segnaposto dei ritratti: "Alessandro Sica" → "AS". */
export function iniziali(nome: string): string {
  return nome
    .split(/\s+/)
    .filter((p) => /^[A-ZÀ-Ý]/.test(p))
    .map((p) => p[0])
    .slice(0, 2)
    .join('');
}
