import * as apiService from '@/services/apiService'

const getKey = params =>
  apiService.get('mystery-web-user/auth/generate/key', params)


export { getKey }