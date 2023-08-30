import { useEffect, useState } from 'react'
import axios from 'axios';
import qs from 'qs'

//useEffect取得token & 取得TDX縣市CCTV (old)
export default function useTDXCCTVSources(selectedCityName, setApiToken, apiToken) {

  const [CCTVSData, setCCTVSData] = useState([]);

  useEffect(() => {

    // 取得token
    !apiToken && axios({
      method: 'POST',
      url: 'https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: qs.stringify({
        grant_type: "client_credentials",
        client_id: process.env.REACT_APP_TDX_KEY,
        client_secret: process.env.REACT_APP_TDX_VAL
      }),
    }).then(res => setApiToken(res.data.access_token))

    // 取得縣市影像
    apiToken && selectedCityName && axios({
      url: `https://tdx.transportdata.tw/api/basic/v2/Road/Traffic/CCTV/City/${selectedCityName}?%24top=1000&%24format=JSON`,
      headers: { "authorization": `Bearer ${apiToken}` }
    }).then(res => {
      setCCTVSData(res.data.CCTVs)
    })
  }, [apiToken, selectedCityName, setApiToken])

  return { CCTVSData }
}