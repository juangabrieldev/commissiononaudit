const rootUrl = 'http://192.168.1.5:4000';

export const authentication = {
    registration: rootUrl + '/login/register/',
    login: rootUrl + '/login/',
};

export const departments = {
  get: rootUrl + '/departments/',
  create: rootUrl + '/departments/create',
  delete: rootUrl + '/departments/delete',
  view: rootUrl + '/departments/view'
};