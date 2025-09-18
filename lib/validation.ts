import { z } from "zod";

export const reportFormSchema = z.object({
  reportDate: z.coerce.date(),
  reportTime: z.string().min(1),
  cashierName: z.string().trim().max(80).optional(),

  sistemToplam: z.coerce.number().min(0),
  nakitToplam: z.coerce.number().min(0),
  digitalToplam: z.coerce.number().min(0),
  araToplam: z.coerce.number().min(0),
  personelToplam: z.coerce.number().min(0),
  kasaToplam: z.coerce.number().min(0),
  marketGideri: z.coerce.number().min(0),

  acKapa: z.coerce.number().min(0), // ← numeric
  note: z.string().max(1000).optional(),
});
export type ReportFormValues = z.infer<typeof reportFormSchema>;
