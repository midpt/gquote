export default {
	myVar1: [],
	myVar2: {},

	myFun1 () {
		//	write code here
		//	this.myVar1 = [1,2,3]
   
	},
	async myFun2 () {
		//	use async-await or promises
		//	await storeValue('varName', 'hello world')
	},

	getUniqueAuthor(obj,prop){
		let unique = obj.reduce(function (acc, curr) {
			if (!acc.includes(curr[prop]))
				acc.push(curr[prop]);
			return acc;
		}, []);
		return unique;

	},

	qryData(){
		return JSObject1.getUniqueAuthor(SelAllAuthor_qry.data,'Authors');
		//console.log(uniAthors );
	},


}
