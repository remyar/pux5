const pg = require('../../../configuration/ps_connection')
let request = require('request')
let Proveedores_config = require('../proveedores-config')

exports.getArticlesById = async function(p_idArticle) {
  let tecdoc =
    await Proveedores_config.Proveedor(Proveedores_config.PROVEEDORES.TECDOC).catch(err => {})

  return new Promise((resolve, reject) => {

    let body = {
      "getArticles": {
        "articleCountry": "hn",
        "provider": tecdoc.password,
        "legacyArticleIds": p_idArticle,
        "includeAll": true
      }
    }

    body = NullsJson(body)
    let option = {
      url: tecdoc.url,
      json: body,
      timeout: 5000
    }

    request.post(option, (err, httpResponse, data) => {
      if (!err) {
        if (httpResponse.statusCode == 200) {
          resolve(data['articles'])
        } else {
          reject(err)
        }
      }else {
        reject(err)
      }
    })
  })
}


function NullsJson(p_json) {
  if (!p_json.getArticles.legacyArticleIds || p_json.getArticles.legacyArticleIds == null) {
    delete p_json.getArticles.legacyArticleIds
  }

  if (!p_json.getArticles.assemblyGroupNodeIds || p_json.getArticles.assemblyGroupNodeIds == null) {
    delete p_json.getArticles.assemblyGroupNodeIds
  }

  if (!p_json.getArticles.linkageTargetId || p_json.getArticles.linkageTargetId == null) {
    delete p_json.getArticles.linkageTargetId
  }
  return p_json
}
