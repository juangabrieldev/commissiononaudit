const localhostAddress = localStorage.getItem('apiUrl');

export const rootUrl = `http://${localhostAddress ? localhostAddress : 'localhost'}:4000`;

export const authentication = {
  registration: rootUrl + '/login/register/',
  login: rootUrl + '/login/',
  verifyToken: rootUrl + '/login/verify',
};

export const announcements = {
  scrape: rootUrl + '/announcements/scrape'
};

export const applications = {
  create: rootUrl + '/applications/',
  view: rootUrl + '/applications/',
  overview: rootUrl + '/applications/overview/',
  applicants: rootUrl + '/applications/applicants/',
  evaluators: rootUrl + '/applications/evaluator/',
};

export const evaluations = {
  create: rootUrl + '/evaluations/',
  get: rootUrl + '/evaluations/',
  update: rootUrl + '/evaluations/update/'
};

export const jobs = {
  create: rootUrl + '/jobs/',
  view: rootUrl + '/jobs/',
  educationType: rootUrl + '/jobs/education-type/'
};

export const documents = {
  post: rootUrl + '/documents/',
  get: rootUrl + '/documents/',
};

export const jobOpportunities = {
  select: rootUrl + '/job-opportunities/jobs/', //for react-select
  create: rootUrl + '/job-opportunities/',
  root: rootUrl + '/job-opportunities/',
  view: rootUrl + '/job-opportunities/view/', //view a job opportunity
  evaluators: rootUrl + '/job-opportunities/evaluators/', //for react-select
};

export const office = {
  get: rootUrl + '/office/',
  create: rootUrl + '/office/create',
  delete: rootUrl + '/office/delete',
  view: rootUrl + '/office/view',
  search: rootUrl + '/office/search',
  clusters: rootUrl + '/office/clusters',
};

export const qualificationStandards = {
  get: rootUrl + '/qualification-standards',
  create: rootUrl + '/qualification-standards',
  delete: rootUrl + '/qualification-standards/delete',
  select: rootUrl + '/qualification-standards/select', //for react-select
  courses: rootUrl + '/qualification-standards/courses', //for react-select
  eligibilities: rootUrl + '/qualification-standards/eligibilities', //for react-select
  trainings: rootUrl + '/qualification-standards/trainings', //for react-select
};

export const systemLogs = {
  get: rootUrl + '/systemlogs'
};

export const employees = {
  create: rootUrl + '/employees/create',
  get: rootUrl + '/employees/',
  avatar: rootUrl + '/employees/avatar/',
  registrationProgress: rootUrl + '/employees/registration-progress/',
  completeRegistration: rootUrl + '/employees/complete-registration/',
  personalDataSheet: rootUrl + '/employees/personal-data-sheet/',
};

export const roles = {
  select: rootUrl + '/roles/select'
};

export const publicFolder = {
  images: rootUrl + '/images/'
};