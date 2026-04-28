import { z } from "zod";

const jobTechTaxonomyItemSchema = z.object({
  concept_id: z.string().nullable(),
  label: z.string().nullable(),
  legacy_ams_taxonomy_id: z.string().nullable(),
});

const weightedJobtechTaxonomyItemSchema = jobTechTaxonomyItemSchema.extend({
  weight: z.number().int().nullable(),
});

const scopeOfWorkSchema = z.object({
  min: z.number().int().nullable(),
  max: z.number().int().nullable(),
});

const employerSchema = z.object({
  phone_number: z.string().nullable(),
  email: z.string().nullable(),
  url: z.string().nullable(),
  organization_number: z.string().nullable(),
  name: z.string().nullable(),
  workplace: z.string().nullable(),
});

const applicationDetailsSchema = z.object({
  information: z.string().nullable(),
  reference: z.string().nullable(),
  email: z.string().nullable(),
  via_af: z.boolean(),
  url: z.string().nullable(),
  other: z.string().nullable(),
});

const workplaceAddressSchema = z.object({
  municipality: z.string().nullable(),
  municipality_code: z.string().nullable(),
  municipality_concept_id: z.string().nullable(),
  region: z.string().nullable(),
  region_code: z.string().nullable(),
  region_concept_id: z.string().nullable(),
  country: z.string().nullable(),
  country_code: z.string().nullable(),
  country_concept_id: z.string().nullable(),
  street_address: z.string().nullable(),
  postcode: z.string().nullable(),
  city: z.string().nullable(),
  coordinates: z.array(z.number().nullable()).nullable(),
});

const requirementsSchema = z.object({
  skills: z.array(weightedJobtechTaxonomyItemSchema).nullable(),
  languages: z.array(weightedJobtechTaxonomyItemSchema),
  work_experiences: z.array(weightedJobtechTaxonomyItemSchema),
  education: z.array(weightedJobtechTaxonomyItemSchema),
  education_level: z.array(weightedJobtechTaxonomyItemSchema),
});

const applicationContactSchema = z.object({
  name: z.string().nullable(),
  description: z.string().nullable(),
  email: z.string().nullable(),
  telephone: z.string().nullable(),
  contact_type: z.string().nullable(),
});

const jobAdDescriptionSchema = z.object({
  text: z.string().nullable(),
  text_formatted: z.string().nullable(),
  company_information: z.string().nullable(),
  needs: z.string().nullable(),
  requirements: z.string().nullable(),
  conditions: z.string().nullable(),
});

const jobAdSchema = z.object({
  id: z.string(),
  external_id: z.string().nullable(),
  original_id: z.string().nullable(),
  label: z.array(z.string()).nullable(),
  webpage_url: z.string(),
  logo_url: z.string().nullable(),
  headline: z.string().nullable(),
  application_deadline: z.iso.datetime({ local: true }).nullable(),
  number_of_vacancies: z.number().int().nullable(),
  description: jobAdDescriptionSchema.nullable(),
  employment_type: jobTechTaxonomyItemSchema.nullable(),
  salary_type: jobTechTaxonomyItemSchema.nullable(),
  salary_description: z.string().nullable(),
  duration: jobTechTaxonomyItemSchema.nullable(),
  working_hours_type: jobTechTaxonomyItemSchema.nullable(),
  scope_of_work: scopeOfWorkSchema.nullable(),
  access: z.string().nullable(),
  employer: employerSchema.nullable(),
  application_details: applicationDetailsSchema.nullable(),
  experience_required: z.boolean().nullable(),
  access_to_own_car: z.boolean().nullable(),
  driving_license_required: z.boolean().nullable(),
  driving_license: z.array(jobTechTaxonomyItemSchema).nullable(),
  occupation: jobTechTaxonomyItemSchema.nullable(),
  occupation_group: jobTechTaxonomyItemSchema.nullable(),
  occupation_field: jobTechTaxonomyItemSchema.nullable(),
  workplace_address: workplaceAddressSchema.nullable(),
  must_have: requirementsSchema.nullable(),
  nice_to_have: requirementsSchema.nullable(),
  application_contacts: z.array(applicationContactSchema).nullable(),
  publication_date: z.iso.datetime({ local: true }).nullable(),
  last_publication_date: z.iso.datetime({ local: true }).nullable(),
  removed: z.boolean().nullable(),
  removed_date: z.iso.datetime({ local: true }).nullable(),
  source_type: z.string().nullable(),
  timestamp: z.number().int().nullable(),
});

const jobAdSearchResultSchema = jobAdSchema.extend({
  relevance: z.number(),
});

const freetextConceptsSchema = z.object({
  skill: z.array(z.string()).nullable(),
  occupation: z.array(z.string()).nullable(),
  trait: z.array(z.string()).nullable(),
  location: z.array(z.string()).nullable(),
  skill_must: z.array(z.string()).nullable(),
  occupation_must: z.array(z.string()).nullable(),
  trait_must: z.array(z.string()).nullable(),
  location_must: z.array(z.string()).nullable(),
  skill_must_not: z.array(z.string()).nullable(),
  occupation_must_not: z.array(z.string()).nullable(),
  trait_must_not: z.array(z.string()).nullable(),
  location_must_not: z.array(z.string()).nullable(),
});

const statDetailSchema = z.object({
  term: z.string().nullable(),
  concept_id: z.string().nullable(),
  code: z.string().nullable(),
  count: z.number().int().nullable(),
});

const statsSchema = z.object({
  type: z.string().nullable(),
  values: z.array(statDetailSchema).nullable(),
});

const numberOfHitsSchema = z.object({
  value: z.number().int(),
});

const searchResponseSchema = z.object({
  total: numberOfHitsSchema,
  positions: z.number().int().nullable(),
  query_time_in_millis: z.number().int().nullable(),
  result_time_in_millis: z.number().int().nullable(),
  stats: z.array(statsSchema).nullable(),
  freetext_concepts: freetextConceptsSchema.nullable(),
  hits: z.array(jobAdSearchResultSchema),
});

export { searchResponseSchema };
