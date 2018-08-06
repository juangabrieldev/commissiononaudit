export const rootUrl = 'http://localhost:4000';

export const authentication = {
    registration: rootUrl + '/login/register/',
    login: rootUrl + '/login/',
};

export const announcements = {
  scrape: rootUrl + '/announcements/scrape'
};

export const departments = {
  get: rootUrl + '/departments/',
  create: rootUrl + '/departments/create',
  delete: rootUrl + '/departments/delete',
  view: rootUrl + '/departments/view'
};

export const systemLogs = {
  get: rootUrl + '/systemlogs'
};