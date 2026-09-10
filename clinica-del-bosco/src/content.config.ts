/**
 * Content Collections — schemi Zod per tutti i contenuti editoriali.
 * I file vivono in src/content/<collection>/<slug>.md (frontmatter YAML + corpo Markdown).
 */
import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const faqItem = z.object({
  domanda: z.string().min(10),
  risposta: z.string().min(40),
});

const fonte = z.object({
  titolo: z.string(),
  url: z.url(),
  ente: z.string().optional(),
});

const tabella = z.object({
  titolo: z.string(),
  intestazioni: z.array(z.string()).min(2),
  righe: z.array(z.array(z.string())).min(1),
  nota: z.string().optional(),
});

const specie = z.enum(['cane', 'gatto', 'coniglio', 'esotici']);

const servizi = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/servizi' }),
  schema: z.object({
    titolo: z.string().min(5),
    titoloBreve: z.string().min(3),
    descrizioneMeta: z.string().min(80).max(160),
    sottotitolo: z.string().min(20),
    risposta: z.string().min(150).max(520),
    icona: z.string(),
    categoria: z.enum([
      'urgenza',
      'diagnostica',
      'chirurgia',
      'specialistica',
      'prevenzione',
      'esotici',
    ]),
    ordine: z.number().int(),
    specie: z.array(specie).min(1),
    correlati: z.array(z.string()).min(2).max(3),
    medicalSpecialty: z.string().optional(),
    inEvidenza: z.boolean().default(false),
    scattoBrief: z.string().optional(),
    faq: z.array(faqItem).min(8).max(10),
    tabella: tabella.optional(),
    fonti: z.array(fonte).min(1),
    autore: reference('equipe'),
    dataPubblicazione: z.coerce.date(),
    dataRevisione: z.coerce.date(),
  }),
});

const equipe = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/equipe' }),
  schema: z.object({
    nome: z.string(),
    titolo: z.enum(['Dott.', 'Dott.ssa']),
    ruolo: z.string(),
    socio: z.boolean().default(false),
    direttoreSanitario: z.boolean().default(false),
    numeroOrdine: z.string(),
    provinciaOrdine: z.string(),
    specializzazioni: z.array(z.string()).min(1),
    aree: z.array(z.string()).default([]),
    formazione: z.array(z.string()).default([]),
    lingue: z.array(z.string()).default(['italiano']),
    scattoBrief: z.string().optional(),
    ordine: z.number().int().default(99),
    daValidare: z.boolean().default(true),
  }),
});

const articoli = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articoli' }),
  schema: z.object({
    titolo: z.string().min(10),
    descrizioneMeta: z.string().min(80).max(160),
    riassunto: z.string().min(150).max(520),
    autore: reference('equipe'),
    revisore: reference('equipe').optional(),
    dataPubblicazione: z.coerce.date(),
    dataRevisione: z.coerce.date(),
    servizioCorrelato: reference('servizi'),
    serviziCorrelati: z.array(reference('servizi')).default([]),
    tag: z.array(z.string()).default([]),
    specie: z.array(specie).min(1),
    tempoLettura: z.number().int().positive(),
    scattoBrief: z.string().optional(),
    faq: z.array(faqItem).min(3).max(8),
    tabella: tabella.optional(),
    fonti: z.array(fonte).min(2),
    inEvidenza: z.boolean().default(false),
  }),
});

const campagne = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/campagne' }),
  schema: z.object({
    titolo: z.string().min(10),
    descrizioneMeta: z.string().min(80).max(160),
    sottotitolo: z.string().min(20),
    risposta: z.string().min(150).max(520),
    periodo: z.string(),
    meseInizio: z.number().int().min(1).max(12),
    meseFine: z.number().int().min(1).max(12),
    servizioCorrelato: reference('servizi'),
    articoloCorrelato: reference('articoli').optional(),
    motivoVisita: z.string(),
    ctaTesto: z.string(),
    specie: z.array(specie).min(1),
    scattoBrief: z.string().optional(),
    checklist: z.array(z.string()).min(3),
    faq: z.array(faqItem).min(4).max(8),
    fonti: z.array(fonte).min(1),
    autore: reference('equipe'),
    dataPubblicazione: z.coerce.date(),
    dataRevisione: z.coerce.date(),
  }),
});

const faq = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/faq' }),
  schema: z.object({
    domanda: z.string().min(10),
    categoria: z.enum([
      'urgenze',
      'visite',
      'costi',
      'chirurgia',
      'diagnostica',
      'piani-salute',
      'struttura',
      'esotici',
    ]),
    ordine: z.number().int().default(99),
    servizioCorrelato: reference('servizi').optional(),
    paginaCorrelata: z.string().optional(),
  }),
});

const zone = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/zone' }),
  schema: z.object({
    nome: z.string(),
    nomeCompleto: z.string(),
    descrizioneMeta: z.string().min(80).max(160),
    risposta: z.string().min(150).max(520),
    tempoAutoMinuti: z.tuple([z.number().int(), z.number().int()]),
    distanzaKm: z.number(),
    comeArrivare: z.array(z.string()).min(2),
    mezziPubblici: z.array(z.string()).default([]),
    quartieri: z.array(z.string()).default([]),
    riferimenti: z.array(z.string()).default([]),
    faq: z.array(faqItem).min(3).max(6),
    ordine: z.number().int().default(99),
    dataRevisione: z.coerce.date(),
  }),
});

const casi = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/casi' }),
  schema: z.object({
    titolo: z.string(),
    specie: specie,
    eta: z.string(),
    servizio: reference('servizi'),
    riassunto: z.string().min(100),
    validato: z.boolean().default(false),
    dataPubblicazione: z.coerce.date(),
  }),
});

export const collections = { servizi, equipe, articoli, campagne, faq, zone, casi };
