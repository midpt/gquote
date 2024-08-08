export default {
	// global variables
	myVar1: [],
	myVar2: {},
	myPageNum:Table_sheet1.pageNo,

	Func1:()=>{
		Image1.setImage(FilePicker1.files[0].data);
		//Image1.setImage('data:image/png, {width=300, height=300}');
		Image1.setImage('data:cover');
		// xmlns=
			//Image1.setImage('data:image/png; width=300 height=300');

	},
		Func2:()=>{
		  // FilePicker1.files[1].data
				Image1.setImage(FilePicker1.files[1].data)
	},
	
	writeToMyStore:() => {
		storeValue("curSelAuthor", Select1.selectedOptionLabel) // String 
	},
	myRunOnLoad () {
		//	write code here
		//	this.myVar1 = [1,2,3]
		//  storeValue('varname', 'Test Text')
		Sheet1Query.run()
		.then(() =>JSObject1.shwQuoteOnTxtBox());
	},
	resetMyVar:() =>{
		this.myPageNum =1
	},
	shwQuoteOnTxtBox:() =>{
		Table_sheet1.setSelectedRowIndex(0)
			.then(() =>Text17_quote.setText(Table_sheet1.selectedRow.Quotes))
	},
	shwMyPgNumOnTxtBox: () =>{
		Text_myPgNum.setText(this.myPageNum.toString());
	},
	tableFirstRowSetTxt:() =>{
		Table_sheet1.setSelectedRowIndex(0)
			.then(() =>Text17_quote.setText(Table_sheet1.selectedRow.Quotes))
			.then(() =>Text_myPgNum.setText(this.myPageNum.toString()))
		showAlert('myPageNum='+this.myPageNum+' \n'+
							'PageSize='+Table_sheet1.pageSize+' \n'+
							'selectedRowIndex='+Table_sheet1.selectedRowIndex+' \n'+
							'selectedRow='+Table_sheet1.selectedRow+' \n'+
							'Select1 Dropdownbox value='+Select1.selectedOptionValue,
							'Info');
	},
	previousPg:() => {
		if(this.myPageNum>0) this.myPageNum=this.myPageNum-1;
	},	
	nxtPg:() => {
		if(this.myPageNum<Table_sheet1.totalRecordsCount )this.myPageNum++;
	},

	myPaging:() =>{
		return (this.myPageNum-1)* Table_sheet1.pageSize;
	},

	incRowIndex:() =>{
		let previousRowRecID=Table_sheet1.selectedRow.rowIndex; // 0 based; If cur Author has 2 Rec, it will count as 0 to 1 
		let pgSz_NumRow= Table_sheet1.pageSize;
		let previousRwIndex=Table_sheet1.selectedRowIndex; //0 based
		let curTblPg_OccupiedRows= Table_sheet1.tableData.length;// 1 based
		let curPgOffset =Table_sheet1.pageOffset;
		let curPgNum=Table_sheet1.pageNo
		let curRwIndex=0;
		let curAuthorRecCnt=1
		let curSelAuthorTotalRec= TotalSelAuthor_qry.data[0].TotalRecord;
		let estTotalPgNum = Math.trunc(curSelAuthorTotalRec/pgSz_NumRow);
		let estLastPg_OccupiedRows=curSelAuthorTotalRec%pgSz_NumRow;
		if (estLastPg_OccupiedRows>0)estTotalPgNum++
		if (estLastPg_OccupiedRows===0 && curPgNum==1)estLastPg_OccupiedRows=curTblPg_OccupiedRows;



		//showAlert('Previous curRwIndex(0-based) ='+curRwIndex,'Info');
		if(previousRwIndex+1<=(curTblPg_OccupiedRows-1)){
			curRwIndex=previousRwIndex+1;
			curAuthorRecCnt++;
			Table_sheet1.setSelectedRowIndex(curRwIndex)
		}
		else{
			previousRwIndex=0;
			//Table_sheet1.setVisibility().pageNo=Table_sheet1.pageNo+1;
			//Table_sheet1.set
			Table_sheet1.setSelectedRowIndex(curRwIndex);
			curAuthorRecCnt++;
			showAlert('Set to first row','Info');
		}

		try {
			showAlert('previousRowRecID='+previousRowRecID+' \n'+
								'pgSz_NumRow='+pgSz_NumRow+' \n'+
								'curTblPg_OccupiedRows='+curTblPg_OccupiedRows+' \n'+
								'previousRwIndex='+previousRwIndex+' \n'+
								'curRwIndex='+curRwIndex+' \n'+
								'curPgOffset='+curPgOffset+' \n'+
								'curPgNum='+curPgNum+' \n'+
								'curSelAuthorTotalRec='+curSelAuthorTotalRec+' \n'+
								'estTotalPgNum='+estTotalPgNum+' \n'+
								'estLastPg_OccupiedRows='+estLastPg_OccupiedRows+' \n',
								'Ino')
		}catch(err){
			showAlert('err.message','Info');
		}


	},

	totalQ4CurAuthor: () => {
		try {
			//data_table.setSelectedRowIndex()
			let selAuthor=appsmith.store.curSelAuthor; //Select1.selectedOptionLabel;
			let  curTblPg_OccupiedRows= Table_sheet1.tableData.length;
			let  pgSz_NumRow= Table_sheet1.pageSize;
			if (curTblPg_OccupiedRows == pgSz_NumRow){
				let  pgNo_TblPg= Table_sheet1.pageNo;

				//let  pgSz_NumRow= data_table.pageSize;
				let  pgOffset_TblPgNum = Table_sheet1.pageOffset;		
				//let curSelAuthor =data_table.tableData[0].Authors;	
				let totalQUp2thisPg=((pgNo_TblPg-1)*pgSz_NumRow)+curTblPg_OccupiedRows;
				showAlert('Total Quotes up to this Page for '+selAuthor + ' is='+totalQUp2thisPg ,'Info');
			}else if(curTblPg_OccupiedRows !=0){
				let  pgNo_TblPg= Table_sheet1.pageNo;
				//let  pgSz_NumRow= data_table.pageSize;
				let  pgOffset_TblPgNum = Table_sheet1.pageOffset;		
				//let  curSelAuthor =data_table.tableData[0].Authors
				let totalQUp2thisPg=((pgNo_TblPg-1)*pgSz_NumRow)+curTblPg_OccupiedRows;
				showAlert('Total Quotes for current selected author \''+  selAuthor + '\'  is='+totalQUp2thisPg ,'Info');

			}
			else{
				let  pgNo_TblPg= Table_sheet1.pageNo;
				//let  pgSz_NumRow= data_table.pageSize;
				let  pgOffset_TblPgNum = Table_sheet1.pageOffset;		
				//	let  curSelAuthor =data_table.tableData[0].Authors				
				let totalQUp2thisPg=((pgNo_TblPg-1)*pgSz_NumRow)+curTblPg_OccupiedRows;
				showAlert('You have pass the end of the page. Total Quotes for current selected author \''+  selAuthor + '\' is='+totalQUp2thisPg ,'Info');			

			}
		}catch(error){
			showAlert(error.message, 'info');
		}
	},


	myFun2:async() =>{
		try {

			let  pgNo_TblPg= Table_sheet1.pageNo;
			let  pgSz_NumRow= Table_sheet1.pageSize;
			let  pgOffset_TblPgNum = Table_sheet1.pageOffset;
			let  curTblPg_OccupiedRows= Table_sheet1.tableData.length; //return num of populated table rows
			let tblDataLn =Sheet1Query.data.length
			//	let  curSelAuthor =data_table.tableData[0].Authors
			//	let  selAuthor_quotesTotal = data_table.tableData.length;

			//	if(isNaN(tblDataLn)) throw "data_table.tableData.length Error";	
			showAlert(
				'tblDataLn='+ tblDataLn+'\n'+' '+
				'curTblPg_OccupiedRows='+ curTblPg_OccupiedRows+'\n'+' '+
				'pgNo_TblPg='+ pgNo_TblPg +'\n'+' '+
				'pgSz_NumRow='+ pgSz_NumRow +	'\n'+' '+
				'pgOffset_TblPgNum ='+pgOffset_TblPgNum +	'\n' , 'info');
			//	'curSelAuthor='+ curSelAuthor+	'\n'+' '+	
			//		'selAuthor_quotesTotal='+ selAuthor_quotesTotal	


		} catch (error) {
			showAlert(error.message, 'info');
		}
	},

	genShw:() =>{
		//showAlert('The table has total '+ data_table.tableData[0].RamID.length, 'info')
		//Object.keys(data_table.tableData).length

		showAlert(
			//	'SelectQuery.data.key= Nxt time take a look' +'\n'+    
			//	'SelectQuery.data[0].count='+SelectQuery.data.length+'\n'+
			'pageNo='+Table_sheet1.pageNo+'\n'+
			'pageSize='+Table_sheet1.pageSize+'\n'+
			'pageOffset='+Table_sheet1.pageOffset+'\n'+
			'totalRecordsCount='+Table_sheet1.totalRecordsCount+'\n'+
			'Total Quotes= '+Table_sheet1.tableData.length +'\n'+
			'Author='+ Table_sheet1.tableData[0].Authors +'\n', 'info'
		)

	},

	//--Used in Select1 Widget onOptionChange Event
	getSelAuthor:() =>{
		storeValue('selAuthor', Select1.selectedOptionLabel)
	},
	setCurRow:() =>{
		//storeValue('selAuthor', Select1.selectedOptionLabel)
	},
	getTotalRecord:() =>{
		//storeValue('curTotalRecord',data_table.totalRecordsCount)
		//.data.length
		storeValue('curTotalRecord','pgsize='+Table_sheet1.pageSize+'  pgOffset='+Table_sheet1.pageOffset)
		//storeValue('curTotalRecord','pgsize='+data_table.pageSize+'  pgOffset='+data_table.tableData.

	},	

	shwTotalRecord:() =>{
		//storeValue('leastRowInx', Select1.selectedOptionLabel)
		//storeValue('highRowInx', data_table)		
		showAlert('The table has total '+ appsmith.store.curTotalRecord , 'info')
	},
	shwSelAuthor:() =>{
		showAlert('You have selected '+ appsmith.store.selAuthor , 'info');
	},

}