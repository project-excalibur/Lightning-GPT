
function generateUuidV4(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (Math.random() * 16) | 0;
        const v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export function getUUID() {

    let uuid:string|null = generateUuidV4();

    if(window && window.localStorage){
        uuid = window.localStorage.getItem('uuid');
        if(!uuid) {
            uuid = generateUuidV4();
            window.localStorage.setItem('uuid', uuid);
        }
    }

  return uuid;
}