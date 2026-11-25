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
  '1': "Ingresso della Clinica Veterinaria del bosco di notte: facciata verde scuro, luce calda dalla porta a vetri, panca accanto all'entrata",
  '2': 'Ingresso del pronto soccorso di notte con barella per animali accanto alla porta automatica illuminata',
  '3': "Chirurgo al lavoro in sala operatoria sotto la lampada scialitica, con il monitor dell'anestesia accanto al tavolo",
  '4': 'Il tomografo computerizzato (TC) della clinica con il lettino del paziente e il monitor per l’anestesia',
  '5': 'Radiografia digitale di un paziente sul monitor della postazione di refertazione',
  '6': 'Un medico del laboratorio inserisce un campione nell’analizzatore',
  '7': 'Cucciolo ricoverato in un box di degenza, scaldato da una lampada a infrarossi',
  '8': 'Visita di un cane bianco sul tavolo dell’ambulatorio, con la veterinaria e il proprietario accanto',
  '9': 'Visita ortopedica: mani guantate che flettono la zampa posteriore di un cane sul tavolo',
  '10': 'Un medico veterinario osserva un vetrino al microscopio del laboratorio',
  '11': 'Visita dermatologica: otoscopio appoggiato al padiglione auricolare di un cane tranquillo',
  '12': "Visita oculistica: oftalmoscopio puntato sull'occhio di un cocker tranquillo",
  '13': 'Visita neurologica: riflesso della zampa anteriore di un cane verificato con il martelletto',
  '14': 'Controllo dei denti di un cane: labbro sollevato con delicatezza da una mano guantata',
  '15': 'Ciotole con crocchette e cibo umido su un piano da lavoro, bilancia e misurino accanto',
  '16': 'La Dott.ssa Isabella Rosapane visita una testuggine sul tavolo',
  '17': 'Cane anziano disteso durante una seduta di agopuntura, aghi sottili lungo il dorso',
  '18': 'Cagnolina gravida distesa su una coperta morbida in un angolo di casa',
  '19': 'Vetrini colorati per citologia allineati su un vassoio del laboratorio',
  '20': "Trasportino per gatto coperto da un telo chiaro su una panca nella sala d'attesa dedicata ai gatti",
  '21': 'Applicazione di un antiparassitario spot-on tra le scapole di un cane',
  '22': "Cane all'ombra di un ombrellone su una spiaggia del golfo di Napoli mentre beve da una ciotola, Vesuvio sullo sfondo",
  '23': "Auto di notte su una strada illuminata mentre raggiunge un edificio con l'ingresso acceso",
  '24': 'Gatto anziano in braccio alla sua proprietaria, ripresa da dietro in ambiente domestico',
  '25': 'Mano di un proprietario appoggiata sulla zampa di un cane sul tavolo da visita',
  '26': 'Flaconcini di vaccino, siringa sigillata e libretto sanitario su un piano pulito',
  '27': 'Cane in giardino al tramonto di inizio estate, controluce con vegetazione mediterranea',
  '28': "Cane disteso all'ombra di una soglia in una giornata estiva, ciotola d'acqua piena accanto",
  '29': 'Controllo della bocca di un gatto: labbro sollevato con delicatezza, denti e gengive sane',
  '30': 'Cane anziano dal muso brizzolato disteso su un tappeto in soggiorno, luce del sole sul pavimento',
  '31': 'Stazione di anestesia con ventilatore e monitor in sala chirurgica',
  '32': 'Mappa stilizzata della costa vesuviana con il Vesuvio e il punto della clinica',
  '33': 'L’équipe della Clinica Veterinaria del bosco riunita nel corridoio della clinica',
  '34': 'L’équipe della clinica che accoglie i proprietari: medici veterinari e personale nel corridoio della clinica',
  '35': 'Un tecnico della clinica tiene in braccio un chihuahua accanto ai box del ricovero',
  '36': 'Il Dott. Dario Ferrari alla stazione di anestesia della sala chirurgica',
  '37': 'Sala di radiologia digitale con il tavolo radiografico',
  '38': 'Banco del laboratorio analisi: una collega prepara un campione accanto agli analizzatori',
  '39': 'Ambulatorio della clinica con tavolo da visita in acciaio, lavabo e scrivania',
  '40': "Sala d'attesa luminosa della clinica con panca in legno, ciotola d'acqua a terra e piante",
  '41': 'Ecocardiografia: immagine del cuore sul monitor dell’ecografo',
  '42': 'Sala endoscopia con torre endoscopica accesa ed endoscopio flessibile sul telo sterile',
  '43': 'Visita di medicina interna su un gatto rosso sul tavolo in acciaio',
  '44': 'Ingresso della Clinica Veterinaria del bosco in Corso Umberto I 12 a Portici, con l’insegna e il cartello H24',
  '45': 'Sala terapie in ordine: tavolo in acciaio, armadio dei farmaci e porta di accesso',
  '46': 'Coniglio bianco e marrone nel box di ricovero, con fieno e verdure fresche',
  '47': 'Primo piano di una testuggine sul tavolo da visita, tenuta con delicatezza da mani guantate',
  '48': 'La Dott.ssa Antonella Sergio durante un esame su un paziente, insieme a un collega',
};

/**
 * Punto di fuoco delle foto reali, come «X-Y» = object-position X% Y%: tiene il soggetto dentro il
 * riquadro quando la stessa foto compare in formati diversi (copertina 4:5, scheda 4:3, testata 16:9).
 * La CSP del sito vieta gli stili inline, quindi ogni valore ha la sua regola in Foto.astro
 * (img[data-fuoco="X-Y"]): il tipo Fuoco elenca i valori che hanno una regola.
 */
export type Fuoco =
  | '35-30'
  | '38-50'
  | '40-45'
  | '45-50'
  | '50-0'
  | '50-5'
  | '50-25'
  | '50-30'
  | '50-35'
  | '50-38'
  | '50-40'
  | '50-45'
  | '50-62'
  | '50-64'
  | '50-15'
  | '50-20'
  | '50-55'
  | '50-100'
  | '70-50';

const fuochi: Record<string, Fuoco> = {
  '3': '50-38',
  '4': '38-50',
  '6': '50-40',
  '7': '50-64',
  '8': '45-50',
  '10': '50-45',
  '31': '50-35',
  '35': '50-20',
  '36': '35-30',
  '38': '50-25',
  '41': '50-38',
  '43': '50-62',
  '44': '50-0',
  '46': '40-45',
  '51': '50-30',
  '52': '50-30',
  '53': '50-30',
  '55': '50-30',
  '56': '50-30',
  // Schede orizzontali 4:3 (elenchi dei servizi) delle foto verticali: il fuoco cambia col formato.
  '3@4/3': '50-45',
  '5@4/3': '50-55',
  '6@4/3': '50-25',
  '7@4/3': '50-100',
  '10@4/3': '50-35',
  '41@4/3': '50-15',
  '43@4/3': '50-100',
  // Schede della home in colonna (4:5, forma libera su mobile): volto della collega in alto.
  '38@4/5': '50-5',
  '48': '70-50',
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

/** Punto di fuoco associato a un numero di scatto, se definito: prima quello del formato, poi quello generale. */
export function fuocoScatto(numero: string | undefined, ratio?: string): Fuoco | undefined {
  if (!numero) return undefined;
  const n = String(Number(numero));
  return (ratio && fuochi[`${n}@${ratio}`]) || fuochi[n];
}
