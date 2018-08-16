export const rootUrl = 'http://localhost:4000';

export const authentication = {
    registration: rootUrl + '/login/register/',
    login: rootUrl + '/login/',
};

export const announcements = {
  scrape: rootUrl + '/announcements/scrape'
};

export const office = {
  get: rootUrl + '/office/',
  create: rootUrl + '/office/create',
  delete: rootUrl + '/office/delete',
  view: rootUrl + '/office/view'
};

export const qualificationStandards = {
  get: rootUrl + '/qualification-standards'
};

export const systemLogs = {
  get: rootUrl + '/systemlogs'
};