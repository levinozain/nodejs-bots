const axios = require("axios");
const { teleToken } = require("../../config.json")

const BASE_URL = `https://api.telegram.org/bot${teleToken}`;
function getAxiosInstance(){
    return {
        get(method, params){
            return axios.get(`/${method}`, {
                baseURL : BASE_URL,
                params,
            });
        },
      post(method, data)  {
          return axios({
              method : "post",
              baseURL : BASE_URL,
              url : `/${method}`,
              data,
          });
      },
    };
}

module.exports = { axiosInstance : getAxiosInstance() }