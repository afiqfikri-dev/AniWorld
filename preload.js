const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('electronAPI', {
// storage
getWatchlist: () => ipcRenderer.invoke('store/get-watchlist'),
getItem: (id) => ipcRenderer.invoke('store/get-item', id),
saveItem: (id, item) => ipcRenderer.invoke('store/save-item', id, item),
deleteItem: (id) => ipcRenderer.invoke('store/delete-item', id),
getHistory: () => ipcRenderer.invoke('store/get-history'),
pushHistory: (entry) => ipcRenderer.invoke('store/push-history', entry),
// jikan wrapper (renderer can also fetch directly)
jikanSearch: (q) => fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(q)}&limit=12`).then(r=>r.json()),
jikanSearchBoth: async (q) => {
// fetch both anime and manga and merge
const a = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(q)}&limit=8`).then(r=>r.json()).catch(()=>({data:[]}));
const m = await fetch(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(q)}&limit=8`).then(r=>r.json()).catch(()=>({data:[]}));
// normalize name/title to 'title' and set type
const anime = (a.data||[]).map(d=>Object.assign({type:'anime'}, d));
const manga = (m.data||[]).map(d=>Object.assign({type:'manga'}, d));
return { data: [...anime, ...manga] };
},
jikanGetById: (type, id) => fetch(`https://api.jikan.moe/v4/${type}/${id}/full`).then(r=>r.json())
});