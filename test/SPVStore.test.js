const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const compiledBTCUtils = require('../build/BTCUtils.json');
const compiledBytes = require('../build/BytesLib.json');
const compiledStore = require('../build/SPVStore.json');
const utils = require('./utils');
const linker = require('solc/linker');

// suppress web3 MaxListenersExceededWarning
// remove when web3 gets its act together
var listeners = process.listeners('warning');
listeners.forEach(listener => process.removeListener('warning', listener));


let accounts;
const HEADER_170 = '0x0100000055bd840a78798ad0da853f68974f3d183e2bd1db6a842c1feecf222a00000000ff104ccb05421ab93e63f8c3ce5c2c2e9dbb37de2764b3a3175c8166562cac7d51b96a49ffff001d283e9e70';

// txid BE: d60033c5cf5c199208a9c656a29967810c4e428c22efb492fdd816e6a0a1e548
const OP_RETURN_TX = '0x010000000001011746bd867400f3494b8f44c24b83e1aa58c4f0ff25b4a61cffeffd4bc0f9ba300000000000ffffffff024897070000000000220020a4333e5612ab1a1043b25755c89b16d55184a42f81799e623e6bc39db8539c180000000000000000166a14edb1b5c2f39af0fec151732585b1049b07895211024730440220276e0ec78028582054d86614c65bc4bf85ff5710b9d3a248ca28dd311eb2fa6802202ec950dd2a8c9435ff2d400cc45d7a4854ae085f49e05cc3f503834546d410de012103732783eef3af7e04d3af444430a629b16a9261e4025f52bf4d6d026299c37c7400000000';
const OP_RETURN_PROOF = '0x48e5a1a0e616d8fd92b4ef228c424e0c816799a256c6a90892195ccfc53300d6e35a0d6de94b656694589964a252957e4673a9fb1d2f8b4a92e3f0a7bb654fddb94e5a1e6d7f7f499fd1be5dd30a73bf5584bf137da5fdd77cc21aeb95b9e35788894be019284bd4fbed6dd6118ac2cb6d26bc4be4e423f55a3a48f2874d8d02a65d9c87d07de21d4dfe7b0a9f4a23cc9a58373e9e6931fefdb5afade5df54c91104048df1ee999240617984e18b6f931e2373673d0195b8c6987d7ff7650d5ce53bcec46e13ab4f2da1146a7fc621ee672f62bc22742486392d75e55e67b09960c3386a0b49e75f1723d6ab28ac9a2028a0c72866e2111d79d4817b88e17c821937847768d92837bae3832bb8e5a4ab4434b97e00a6c10182f211f592409068d6f5652400d9a3d1cc150a7fb692e874cc42d76bdafc842f2fe0f835a7c24d2d60c109b187d64571efbaa8047be85821f8e67e0e85f2f5894bc63d00c2ed9d640296ef123ea96da5cf695f22bf7d94be87d49db1ad7ac371ac43c4da4161c8c2';
const OP_RETURN_INDEX = 282;
const OP_RETURN_HEADER = '0x0000002073bd2184edd9c4fc76642ea6754ee40136970efc10c4190000000000000000000296ef123ea96da5cf695f22bf7d94be87d49db1ad7ac371ac43c4da4161c8c216349c5ba11928170d38782b';

// txid BE: b2e80a7f77eaca95c2e57938199022bddee0b0a56e0574f52e415ee907992654
const TWO_IN_TX = '0x010000000001027bb2b8f32b9ebf13af2b0a2f9dc03797c7b77ccddcac75d1216389abfa7ab3750000000000ffffffffaa15ec17524f1f7bd47ab7caa4c6652cb95eec4c58902984f9b4bcfee444567d0000000000ffffffff024db6000000000000160014455c0ea778752831d6fc25f6f8cf55dc49d335f040420f0000000000220020aedad4518f56379ef6f1f52f2e0fed64608006b3ccaff2253d847ddc90c9192202483045022100d9fb1c15fe691c06dace09305bdd7e3cd19ada9c9392ca3a8c0a6f22a61c2ef002206efd72d89b6c1680d4135de14887a774ad0d6ad81dcd15833c3dc30b90a5ca86012102d0ec63b4c9f3d9e8083a0216c22d675f6f9a5b0bf1931f09a690e7e8bb24f63402483045022100fc7bf8811762a0c25c65deed711304ffd81413a347b656f45e38e3be40ecfcb8022077a020fda57e57062f99e2c0b714d251a879664bdb6dffcb04642182645470ea0121039b3e8cd31336f9ce7733885cf6d64433df129ce4c274b089825bf1419d047a4300000000';
const TWO_IN_PROOF = '0x54269907e95e412ef574056ea5b0e0debd2290193879e5c295caea777f0ae8b2602ac17ae2e219873600eb2b6fb301f31894121b475f19d394d92122de353e3e47254a20aa67eb76e73f284b11fb1d0e101100753d8ab7818961220cdd26860f756c859e76151b1d368a7f102649eca20ff00bf3e664a1dfa420af1f81077c94c8b9827f337f48d24a0f556bace3a35439451c788b4ba0453de5c8c3fd7e841003b7dd274c3b118e94b2286c725b61e72432a305593e91bf7c0fe1c423d4cb0a21a4fa31617fd9938a1b57649466837632a44faf6f36704a01a39a2e7a545ec3a1e6309f5aadca2171cac2beff0896c6a251c877ad42d1c414293bd7e36a02c5b5415b45f1a13f4a01926f28017ba01b2cca53ec53224acb2934d43499a83a18d3a0d186fe6c8e85faa6bde57b521af40617cb24d59b50933eda6d64a5d6ffc1b3cf4f35d6040e60a67c3f270ef7e237066cf2118d7767a6161ec4f1ff24ac70a2f0d7763665a84f267898e93e5ec693ddb4938aa2d9caca11b1462bc6b772a8743c578ec3d89fd330b90126d2f758e9319c4d3232aed3545bda2fbcb9d39af17209f58088422fc42c5849f910c29ec174fbf89bf4fb25b5600d024773ee5a5e';
const TWO_IN_INDEX = 782;
const TWO_IN_HEADER = '0x0000002044f2432df0e5b61161259717e975a0d9583f9536d53f020000000000000000007209f58088422fc42c5849f910c29ec174fbf89bf4fb25b5600d024773ee5a5e6c339c5ba1192817c6ed8f78';


describe('SPVStore', async () => {
    let storeContract;

    beforeEach(async () => {
        let bc;

        accounts = await web3.eth.getAccounts();

        let bytesContract = await new web3.eth.Contract(JSON.parse(compiledBytes.interface))
            .deploy({ data: compiledBytes.bytecode})
            .send({ from: accounts[0], gas: 5000000, gasPrice: 100000000000});

        assert.ok(bytesContract.options.address);

        // Link
        bc = await linker.linkBytecode(compiledBTCUtils.bytecode,
             {'BytesLib.sol:BytesLib': bytesContract.options.address});

        let btcUtilsContract = await new web3.eth.Contract(JSON.parse(compiledBTCUtils.interface))
            .deploy({ data: bc })
            .send({ from: accounts[0], gas: 5000000, gasPrice: 100000000000});

        assert.ok(btcUtilsContract.options.address);

        bc = await linker.linkBytecode(compiledStore.bytecode,
                    {'SPV.sol:BTCUtils': btcUtilsContract.options.address,
                     'BytesLib.sol:BytesLib': bytesContract.options.address});

        storeContract = await new web3.eth.Contract(JSON.parse(compiledStore.interface))
            .deploy({ data: bc })
            .send({ from: accounts[0], gas: 5000000, gasPrice: 100000000000});

        assert.ok(storeContract.options.address);
    });

    it('validates, parses, and stores txns', async () => {
        let res;
        res = await storeContract.methods.validateTransaction(OP_RETURN_TX, OP_RETURN_PROOF, OP_RETURN_INDEX, OP_RETURN_HEADER)
            .send({ from: accounts[0], gas: 5000000, gasPrice: 100000000000});
        assert.ok(res.events.TxParsed);
        assert.equal(res.events.TxParsed.returnValues._hash, '0x48e5a1a0e616d8fd92b4ef228c424e0c816799a256c6a90892195ccfc53300d6');

        res = await storeContract.methods.transactions('0x48e5a1a0e616d8fd92b4ef228c424e0c816799a256c6a90892195ccfc53300d6').call();
        assert.equal(res[0], '0x48e5a1a0e616d8fd92b4ef228c424e0c816799a256c6a90892195ccfc53300d6');
        assert.equal(res[1], 0);
        assert.equal(res[2], 1);
        assert.equal(res[3], 2);

        res = await storeContract.methods.validateTransaction(TWO_IN_TX, TWO_IN_PROOF, TWO_IN_INDEX, TWO_IN_HEADER)
            .send({ from: accounts[0], gas: 5000000, gasPrice: 100000000000});
        assert.ok(res.events.TxParsed);
        assert.equal(res.events.TxParsed.returnValues._hash, '0x54269907e95e412ef574056ea5b0e0debd2290193879e5c295caea777f0ae8b2');

        res = await storeContract.methods.transactions('0x54269907e95e412ef574056ea5b0e0debd2290193879e5c295caea777f0ae8b2').call();
        assert.equal(res[0], '0x54269907e95e412ef574056ea5b0e0debd2290193879e5c295caea777f0ae8b2');
        assert.equal(res[1], 0);
        assert.equal(res[2], 2);
        assert.equal(res[3], 2);
    });

    it('validates, parses, and stores block headers', async () => {
        let res;
        res = await storeContract.methods.parseAndStoreHeader(HEADER_170)
            .send({ from: accounts[0], gas: 5000000, gasPrice: 100000000000});
        assert.ok(res.events.HeaderParsed);
        assert.equal(res.events.HeaderParsed.returnValues._hash, '0x00000000d1145790a8694403d4063f323d499e655c83426834d4ce2f8dd4a2ee');

        res = await storeContract.methods.parseAndStoreHeader(OP_RETURN_HEADER)
            .send({ from: accounts[0], gas: 5000000, gasPrice: 100000000000});
        assert.ok(res.events.HeaderParsed);
        assert.equal(res.events.HeaderParsed.returnValues._hash, '0x00000000000000000024cc6777e93673f53853240d34f1bb7fb1d63983e470fe');

        res = await storeContract.methods.parseAndStoreHeader(TWO_IN_HEADER)
            .send({ from: accounts[0], gas: 5000000, gasPrice: 100000000000});
        assert.ok(res.events.HeaderParsed);
        assert.equal(res.events.HeaderParsed.returnValues._hash, '0x00000000000000000019c410fc0e973601e44e75a62e6476fcc4d9ed8421bd73');
    });
});