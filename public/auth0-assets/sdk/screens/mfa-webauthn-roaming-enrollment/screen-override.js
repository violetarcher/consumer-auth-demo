import{Screen as e}from"../../models/screen.js";import{getPublicKey as t,getWebAuthnType as s}from"../../shared/screen.js";class c extends e{webauthnType;publicKey;constructor(e){super(e),this.publicKey=c.getPublicKey(e),this.webauthnType=c.getWebAuthnType(e)}static getPublicKey=e=>t(e);static getWebAuthnType=e=>s(e)}export{c as ScreenOverride};
//# sourceMappingURL=screen-override.js.map
