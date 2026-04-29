import { z } from "zod";

const jobTechTaxonomyItemSchema = z.object({
  concept_id: z.string().nullish(),
  label: z.string().nullish(),
  legacy_ams_taxonomy_id: z.string().nullish(),
});

const weightedJobtechTaxonomyItemSchema = jobTechTaxonomyItemSchema.extend({
  weight: z.number().int().nullish(),
});

const scopeOfWorkSchema = z.object({
  min: z.number().int().nullish(),
  max: z.number().int().nullish(),
});

const employerSchema = z.object({
  phone_number: z.string().nullish(),
  email: z.string().nullish(),
  url: z.string().nullish(),
  organization_number: z.string().nullish(),
  name: z.string().nullish(),
  workplace: z.string().nullish(),
});

const applicationDetailsSchema = z.object({
  information: z.string().nullish(),
  reference: z.string().nullish(),
  email: z.string().nullish(),
  via_af: z.boolean(),
  url: z.string().nullish(),
  other: z.string().nullish(),
});

const workplaceAddressSchema = z.object({
  municipality: z.string().nullish(),
  municipality_code: z.string().nullish(),
  municipality_concept_id: z.string().nullish(),
  region: z.string().nullish(),
  region_code: z.string().nullish(),
  region_concept_id: z.string().nullish(),
  country: z.string().nullish(),
  country_code: z.string().nullish(),
  country_concept_id: z.string().nullish(),
  street_address: z.string().nullish(),
  postcode: z.string().nullish(),
  city: z.string().nullish(),
  coordinates: z.array(z.number().nullish()).nullish(),
});

const requirementsSchema = z.object({
  skills: z.array(weightedJobtechTaxonomyItemSchema).nullish(),
  languages: z.array(weightedJobtechTaxonomyItemSchema),
  work_experiences: z.array(weightedJobtechTaxonomyItemSchema),
  education: z.array(weightedJobtechTaxonomyItemSchema),
  education_level: z.array(weightedJobtechTaxonomyItemSchema),
});

const applicationContactSchema = z.object({
  name: z.string().nullish(),
  description: z.string().nullish(),
  email: z.string().nullish(),
  telephone: z.string().nullish(),
  contact_type: z.string().nullish(),
});

const jobAdDescriptionSchema = z.object({
  text: z.string().nullish(),
  text_formatted: z.string().nullish(),
  company_information: z.string().nullish(),
  needs: z.string().nullish(),
  requirements: z.string().nullish(),
  conditions: z.string().nullish(),
});

const jobAdSchema = z.object({
  id: z.string(),
  external_id: z.string().nullish(),
  original_id: z.string().nullish(),
  label: z.array(z.string()).nullish(),
  webpage_url: z.string(),
  logo_url: z.string().nullish(),
  headline: z.string().nullish(),
  application_deadline: z.iso.datetime({ local: true }).nullish(),
  number_of_vacancies: z.number().int().nullish(),
  description: jobAdDescriptionSchema.nullish(),
  employment_type: jobTechTaxonomyItemSchema.nullish(),
  salary_type: jobTechTaxonomyItemSchema.nullish(),
  salary_description: z.string().nullish(),
  duration: jobTechTaxonomyItemSchema.nullish(),
  working_hours_type: jobTechTaxonomyItemSchema.nullish(),
  scope_of_work: scopeOfWorkSchema.nullish(),
  access: z.string().nullish(),
  employer: employerSchema.nullish(),
  application_details: applicationDetailsSchema.nullish(),
  experience_required: z.boolean().nullish(),
  access_to_own_car: z.boolean().nullish(),
  driving_license_required: z.boolean().nullish(),
  driving_license: z.array(jobTechTaxonomyItemSchema).nullish(),
  occupation: jobTechTaxonomyItemSchema.nullish(),
  occupation_group: jobTechTaxonomyItemSchema.nullish(),
  occupation_field: jobTechTaxonomyItemSchema.nullish(),
  workplace_address: workplaceAddressSchema.nullish(),
  must_have: requirementsSchema.nullish(),
  nice_to_have: requirementsSchema.nullish(),
  application_contacts: z.array(applicationContactSchema).nullish(),
  publication_date: z.iso.datetime({ local: true }).nullish(),
  last_publication_date: z.iso.datetime({ local: true }).nullish(),
  removed: z.boolean().nullish(),
  removed_date: z.iso.datetime({ local: true }).nullish(),
  source_type: z.string().nullish(),
  timestamp: z.number().int().nullish(),
});

const jobAdSearchResultSchema = jobAdSchema.extend({
  relevance: z.number().nullish(),
});

const freetextConceptsSchema = z.object({
  skill: z.array(z.string()).nullish(),
  occupation: z.array(z.string()).nullish(),
  trait: z.array(z.string()).nullish(),
  location: z.array(z.string()).nullish(),
  skill_must: z.array(z.string()).nullish(),
  occupation_must: z.array(z.string()).nullish(),
  trait_must: z.array(z.string()).nullish(),
  location_must: z.array(z.string()).nullish(),
  skill_must_not: z.array(z.string()).nullish(),
  occupation_must_not: z.array(z.string()).nullish(),
  trait_must_not: z.array(z.string()).nullish(),
  location_must_not: z.array(z.string()).nullish(),
});

const statDetailSchema = z.object({
  term: z.string().nullish(),
  concept_id: z.string().nullish(),
  code: z.string().nullish(),
  count: z.number().int().nullish(),
});

const statsSchema = z.object({
  type: z.string().nullish(),
  values: z.array(statDetailSchema).nullish(),
});

const numberOfHitsSchema = z.object({
  value: z.number().int(),
});

const searchResponseSchema = z.object({
  total: numberOfHitsSchema,
  positions: z.number().int().nullish(),
  query_time_in_millis: z.number().int().nullish(),
  result_time_in_millis: z.number().int().nullish(),
  stats: z.array(statsSchema).nullish(),
  freetext_concepts: freetextConceptsSchema.nullish(),
  hits: z.array(jobAdSearchResultSchema),
});

export { searchResponseSchema, jobAdSearchResultSchema };
