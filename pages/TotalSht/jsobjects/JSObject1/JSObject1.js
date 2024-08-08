export default {
	myVar1: [],
	myVar2: {},
	myFun1 () {
		//	write code here
		//	this.myVar1 = [1,2,3]
	},
	
	totalQuotesFormula:() =>{
		storeValue('qTotalFormula', '=COUNTIF(Sheet1!H2:H,B2)')
	},
	
	setDefault_Formula:() =>{
		let TotalQuote_formula = "=COUNTIF(Sheet1!H2:H,B2)"
		
		return TotalQuote_formula
	},
	
	async myFun2 () {
		//	use async-await or promises
		//	await storeValue('varName', 'hello world')
		
		
		
	}
}