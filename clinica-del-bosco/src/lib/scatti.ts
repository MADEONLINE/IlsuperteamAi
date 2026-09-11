/**
 * Registro degli scatti fotografici.
 *
 * Ogni riquadro fotografico del sito è identificato dal numero di scatto del BRIEF-FOTO.
 * Qui il numero viene risolto nel file reale in `src/assets/img/scatto-NN-*.jpg` e nel suo
 * testo alternativo. Quando arriva la foto definitiva basta sostituire il file mantenendo
 * il prefisso `scatto-NN-`: nessuna pagina va toccata.
 */
import type { ImageMetadata } from 'astro';

const moduli = import.meta.glob<ImageMetadata>('../assets/img/scatto-*.{jpg,jpeg,png,avif,webp}', {
  eager: true,
  import: 'default',
});

const perNumero = new Map<string, ImageMetadata>();
for (const [percorso, immagine] of Object.entries(moduli)) {
  const numero = /scatto-(\d+)-/.exec(percorso)?.[1];
  if (numero) perNumero.set(String(Number(numero)), immagine);
}

/** Testi alternativi: descrittivi, non decorativi (requisito WCAG e segnale per i motori). */
const alternativi: Record<string, string> = {
  '1': "Ingresso della Clinica Veterinaria del Bosco di notte: facciata verde scuro, luce calda dalla porta a vetri, panca accanto all'entrata",
  '2': 'Ingresso del pronto soccorso di notte con barella per animali accanto alla porta automatica illuminata',
  '3': 'Intervento chirurgico in corso: mani guantate e strumenti sopra un telo sterile verde',
  '4': 'Sala TAC della clinica: tomografo computerizzato con lettino imbottito e finestra sulla console',
  '5': 'Ecografia addominale su un cane sdraiato, sonda in mano e monitor acceso',
  '6': 'Banco del laboratorio analisi interno: analizzatore, provette con tappo verde e viola, microscopio sullo sfondo',
  '7': 'Cane ricoverato in terapia intensiva dentro una gabbia a ossigeno, monitor con tracciato accanto',
  '8': 'Vaccinazione di un cucciolo tenuto con delicatezza sul tavolo da visita',
  '9': 'Visita ortopedica: mani guantate che flettono la zampa posteriore di un cane sul tavolo',
  '10': 'Microscopio del laboratorio con vetrino inserito e vassoio di vetrini colorati accanto',
  '11': 'Visita dermatologica: otoscopio appoggiato al padiglione auricolare di un cane tranquillo',
  '14': 'Controllo dei denti di un cane: labbro sollevato con delicatezza da una mano guantata',
  '16': 'Coniglio nano grigio sul tavolo da visita coperto da un telo verde, stetoscopio accanto',
  '17': 'Cane anziano disteso durante una seduta di agopuntura, aghi sottili lungo il dorso',
  '20': "Trasportino per gatto coperto da un telo chiaro su una panca nella sala d'attesa dedicata ai gatti",
  '21': 'Applicazione di un antiparassitario spot-on tra le scapole di un cane',
  '22': "Cane all'ombra di un ombrellone su una spiaggia del golfo di Napoli mentre beve da una ciotola, Vesuvio sullo sfondo",
  '24': 'Gatto anziano in braccio alla sua proprietaria, ripresa da dietro in ambiente domestico',
  '25': 'Mano di un proprietario appoggiata sulla zampa di un cane sul tavolo da visita',
  '31': 'Sala chirurgica della clinica pronta per un intervento: tavolo operatorio con telo verde e lampada scialitica accesa',
  '32': 'Mappa stilizzata della costa vesuviana con il Vesuvio e il punto della clinica',
  '33': 'Bancone della reception con piante, lettore di carte e scaffali ordinati alle spalle',
  '34': 'Accettazione della clinica di notte: bancone illuminato e barella per animali pronta',
  '35': 'Reparto degenza: box in acciaio con porte in vetro e cucce morbide, un gatto che dorme',
  '36': 'Seconda sala operatoria attrezzata per la chirurgia ortopedica, con negatoscopio acceso',
  '37': 'Console della diagnostica per immagini vista attraverso il vetro piombato, monitor con sezioni TAC',
  '38': 'Laboratorio analisi della clinica: banco con analizzatori, centrifuga e microscopio',
  '39': 'Ambulatorio pronto per la visita: tavolo in acciaio, bilancia a terra, stetoscopio appeso',
  '40': "Sala d'attesa luminosa della clinica con panca in legno, ciotola d'acqua a terra e piante",
  '41': 'Ecocardiografia su un beagle disteso sul fianco, sonda sul torace e monitor con Doppler a colori',
  '42': 'Sala endoscopia con torre endoscopica accesa ed endoscopio flessibile sul telo sterile',
  '43': 'Visita di medicina interna: palpazione addominale di un gatto sul tavolo in acciaio',
  '44': 'Facciata della clinica di giorno: vetrina ampia, tenda verde scuro, rampa di accesso',
};

/** Immagine associata a un numero di scatto, se già disponibile. */
export function scatto(numero: string | undefined): ImageMetadata | undefined {
  if (!numero) return undefined;
  return perNumero.get(String(Number(numero)));
}

/** Testo alternativo associato a un numero di scatto. */
export function altScatto(numero: string | undefined): string | undefined {
  if (!numero) return undefined;
  return alternativi[String(Number(numero))];
}
