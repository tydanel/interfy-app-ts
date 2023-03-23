export const selectAuth              = ({ auth }) => auth;
export const selectAuthToken         = ({ auth }) => auth.token;
export const selectAuthUser          = ({ auth }) => auth.user;
export const selectAuthCompanyKey    = ({ auth }) => auth.company_key;
export const selectAuthStatus        = ({ auth }) => auth.status;
export const selectAuthErrorMessage  = ({ auth }) => auth.errorMessage;
export const selectAuthServerAddress = ({ auth }) => auth.serverAddress;
export const selectEditorHtml        = ({ editor }) => editor.html;
export const selectEditorJson        = ({ editor }) => editor.json;

export const selectProducts              = ({ products }) => products;
export const selectCurrentProduct        = ({ products }) => products.current;
export const selectProductItems          = ({ products }) => products.items
export const selectProductsLoading       = ({ products }) => products.loading;
export const selectProductsStatus        = ({ products }) => products.status;
export const selectProductsStatusTimeout = ({ products }) => products.statusTimeout;
