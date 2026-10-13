'use strict';
const PerlerClient=(()=>{
 let seq=0;const pending=new Map();
 window.addEventListener('message',e=>{if(e.source!==window||e.origin!==location.origin||e.data?.type!=='PERLER_RESPONSE')return;const p=pending.get(e.data.id);if(!p)return;pending.delete(e.data.id);clearTimeout(p.timer);e.data.ok?p.resolve(e.data):p.reject(Error(e.data.error||'采集扩展响应失败'));});
 async function request(action,fields={}){
  if(location.protocol==='chrome-extension:'&&typeof chrome!=='undefined'&&chrome.runtime?.id){const result=await chrome.runtime.sendMessage({channel:'PERLER_CONTROL',action,...fields});if(!result?.ok)throw Error(result?.error||'采集器响应失败');return result;}
  const id='perler-'+Date.now()+'-'+(++seq);
  return new Promise((resolve,reject)=>{const timer=setTimeout(()=>{pending.delete(id);reject(Error('未连接采集扩展。请在 Chrome 中安装扩展并刷新面板。'));},5000);pending.set(id,{resolve,reject,timer});window.postMessage({type:'PERLER_REQUEST',id,action,...fields},location.origin);});
 }
 return {request};
})();
