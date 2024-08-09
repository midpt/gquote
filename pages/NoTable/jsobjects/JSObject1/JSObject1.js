export default {
	myVar1: [],
	myVar2: {},
	firstLoad:1,
	rowToSkipB4Qry:0,
	favRowToSkipB4Qry:0,
	totalRec4CurAuthor:AuthorTotal_qry.data.filter(i=>i.AuthorNoRepeat==Select_author.selectedOptionValue).map(a=>a.TotalRecord),
	favTotalRec4CurAuthor:0,
	totalRecInSheet1:0,
	lastRecNo:0,
	nonFavSelOpt:[],
	favTotal:0,
	usrFavTotal:0, // keep count how many favorite quotes current user has
	usrCurFav:0, // This track current user  Favourite viewing quote number
	usrFavUnicAthrTotal:0, // keep count how many favorite unique Authors current user has
	favViewActive:0, // 1 user want to view his Favourie quotes; changes when user click butt_star

	func1(){
		//	Select_author.setOptions("apple"); 
		//--set defualt selected label
		//Select_author.setSelectedOption("Mahatma Gandhi")
		//	.then(()=>showAlert(Select_author.selectedOptionValue+'  '+Select_author.selectedOptionLabel))
		Container2.setVisibility(false)

	},


	createSelOption: async(obj)=> {
		let favSelOpt=[]
		//--if user Favourite quotes has more than 1 Authors then build the dropdown option list	
		if (obj.length>1){
			//const favUnicAthr = ["TM" "TF", "Mahatma Gandhi"];
			const nwObj = await obj.map(ary=>{
				let newrow={label:ary, value:ary};
				favSelOpt.push(newrow)
			})
			console.log(favSelOpt);
			// save current non favourite view Select Option list, so that when user switch back to non Fav view,
			//  We will repopulate the dropdown
			this.nonFavSelOpt=Select_author.options; 
			//--set defualt selected label
			Select_author.setSelectedOption(favSelOpt[0].value);// cannot force to TM since usr may not have added TM. best is to get the FIRST option value
			//---Now populate the Dropdown with new option lists
			Select_author.setOptions(favSelOpt);
			//		return 	favSelOpt;	
		}else{ //user Favourite quotes has only 1 Author & currently is in Favourite viewing
			if (this.favViewActive) {
				Select_author.selectedOptionValue(obj[0]);
				//			return obj[0];
			}
		}  
	},
	getFavUniqueAuthor: async() => {
		this.usrFavUnicAthrTotal=0
		//-- get current user Fav distinct Authors i.e Not TF,TF,TM ; but TF,TM
		let favUnicAthr=await FavNotUseInTable1_qry.data.reduce(function (acc, cur){
			if ( !acc.includes(cur.Authors) && cur.UserEmail==appsmith.user.email ){
				acc.push(cur.Authors);
				this.usrFavUnicAthrTotal++;
			}
			//Object.assign(acc,cur.Authors);

			return acc;
		},[])
		console.log('this.usrFavUnicAthrTotal='+this.usrFavUnicAthrTotal);
		return favUnicAthr;
	},
	//---called when a user clicks on Star button
	getFavUniAthrThenMakeSelOpt: async()=>{
		var ress;	
		await JSObject1.getFavUniqueAuthor()
			.then(  (favUniqueAthr)=> JSObject1.createSelOption(favUniqueAthr))
			.then ((result)=>{ress=result; })
			.then (() => FavNotUseInTable2_qry.run())
			.then(() => {this.favTotalRec4CurAuthor= FavNotUseInTable2_qry.data.length;console.log('In getFavUniAthrThe...  this.favTotalRec4CurAuthor='+this.favTotalRec4CurAuthor+' favTotal='+this.favTotal);return 'ok'} )
			.then (() =>JSObject1.shwQuoteOnTxtBox())
		//return ress;
	},

	totalRowInSht1NFav: async()=>{
		//--Purpose is to find total record rows in Sheet1 and sheet Favourite in Google Sheet
		//--Query (or API) Sht1andFavTotal_qry is get this info from sheet TotalSht in Google Sheet Quotes
		// this.totalRecInSheet1
		//  Sht1andFavTotal_qry has only TWO rows, hence we can reference is using 0 and 1
		await Sht1andFavTotal_qry.run()
			.then( (d)=>{
			this.totalRecInSheet1=d[0].TotalRecords;
			this.favTotal=d[1].TotalRecords;
		})
		//return this.totalRecInSheet1
	},	

	//--Used in Dropdown Select_author after user click a selection
	refreshTotalRec:async() =>{
		//-----If user want to view main quote i.e not Favorite view
		if (!this.favViewActive){	
			this.rowToSkipB4Qry=0;

			this.totalRec4CurAuthor= await AuthorTotal_qry.data.filter(i=>i.AuthorNoRepeat==Select_author.selectedOptionValue).map(a=>a.TotalRecord)
			console.log('B4 else resfreshTotalRec  Select_author.selectedOptionValu='+Select_author.selectedOptionValue+' this.totalRec4CurAuthor='+this.totalRec4CurAuthor)
			JSObject1.shwQuoteOnTxtBox()

		}else{ //----user want to view Fav quote
			let curUsrSelAthr=Select_author.selectedOptionValue;
			let ress=0;
			await FavNotUseInTable1_qry.data.filter(i=>i.Authors==curUsrSelAthr && i.UserEmail==appsmith.user.email.toString()).map(a=>ress++);
			this.favTotalRec4CurAuthor=ress;
			this.favRowToSkipB4Qry=0;
			console.log('Else in resfreshTotalRec  favTotalRec4CurAuthor='+this.favTotalRec4CurAuthor);
			JSObject1.shwQuoteOnTxtBox()

		}	
	},

	//---use in Sh1NotUsedInTable__qry and Sh1NotUsedInTable__qry 
	myPging:() =>{
		//-----If user want to view main quote i.e not Favorite view
		if (!this.favViewActive){	
			return this.rowToSkipB4Qry

			// user want to view Favorite view	
		}else{
			return this.favRowToSkipB4Qry;
		}
	},

	shwQuoteOnTxtBox:()=>{
    if(appsmith.user.username=='anonymousUser'){
			Butt_addFav.setVisibility(false);
			Butt_addFav.setDisabled(true);
			Butt_star.setVisibility(false)
			Butt_star.setDisabled(true);
		}
		//-----If user want to view main quote i.e not Favorite view
		if (!this.favViewActive){	
			//Butt_star.setVisibility(false)
			Sh1NotUsedInTable__qry.run()
				.then(() =>Text1_quote.setText(Sh1NotUsedInTable__qry.data[0].Quotes).toString())
				.then(() => JSObject1.shwPgNum())
				.then(() =>{if(this.firstLoad){JSObject1.chkHasUsrFav();this.firstLoad=0}})

			//  .then(()=>showAlert('chkHasUsrFav is async & had returned.'))
			//	.then(() =>{showAlert('rowToSkipB4Qry='+this.rowToSkipB4Qry.toString()+'\n '+'totalRec4CurAuthor='+this.totalRec4CurAuthor,'Info')})


		}else{//--user want to view Favorite Quotes
			FavNotUseInTable2_qry.run()
				.then(()=> Text1_quote.setText(FavNotUseInTable2_qry.data[0].Quotes.toString()) )
				.then(() => JSObject1.shwPgNum())
		}
	},
	//--called when a user clicks on Shuffle checkbox
	chkHasUsrFav: async()=>{
		this.usrFavTotal=0;
		var nomtch=0;
		FavNotUseInTable1_qry.run()
			.then(()=>FavUseInTable_qry.run())
			.then(()=>{
			FavUseInTable_qry.data.filter( itm=>{
				return	itm.UserEmail==appsmith.user.email?this.usrFavTotal++:nomtch++;
			})
		}).then(()=>this.usrFavTotal>0?Butt_star.setVisibility(true):Butt_star.setVisibility(true))
		//.then(()=>showAlert('2nd showAlert  this.usrFavTotal='+this.usrFavTotal))
			.then(()=>{
			if (this.usrFavTotal>0){
				//Select_author.options.map()
				return this.usrFavTotal;
			}
		})

	},

	shwPgNum: async()=>{
		//-----If user want to view main quote i.e not Favorite view
		if (!this.favViewActive){	
			let curN=await (JSObject1.rowToSkipB4Qry+1).toString();
			Text_curQNum.setText(curN+'/');
			let tnum=await (JSObject1.totalRec4CurAuthor).toString();
			Text_totalQ.setText(tnum);
			//return showAlert('curQuoteNum='+curN+' totalCurAthrQuote='+JSObject1.totalRec4CurAuthor.toString());
			return 'Ok';

		}else{ // user want to view Fav Quote
			let curN=(JSObject1.favRowToSkipB4Qry+1).toString();
			Text_curQNum.setText(curN+'/');
			Text_totalQ.setText(JSObject1.favTotalRec4CurAuthor.toString());		
			//return showAlert('curQuoteNum='+curN+' totalCurFavAthrQuote='+JSObject1.favTotalRec4CurAuthor);
			return 'Ok';

		}
	},

	async nxtPg(){
		//-----If user want to view main quote i.e not Favorite view
		if (!this.favViewActive){	
			//---if not random quote view
			if(!Checkbox1.isChecked ){	
				//		let myPromise = new Promise(function(resolve,reject) {
				if (this.rowToSkipB4Qry<this.totalRec4CurAuthor-1 ){
					return	this.rowToSkipB4Qry++;
					//	var aa=  AuthorTotal_qry.data.filter(i=>i.AuthorNoRepeat.filter(j=>j.AuthorNoRepeat))
					//	resolve('nxtPg Ok.');
				}else{return show('You have reached the last record for this Author!')}
				//});

				//--Get randomised Quote--
			}else JSObject1.chkBox1();

		}else{ //-----------user want to view Favorite quote--------------	
			//---if not random quote view. i.e user want to view Quote sequentially
			if(!Checkbox1.isChecked ){	
				//		let myPromise = new Promise(function(resolve,reject) {
				if (this.favRowToSkipB4Qry<this.favTotalRec4CurAuthor-1 ){
					return	this.favRowToSkipB4Qry++;
					//	var aa=  AuthorTotal_qry.data.filter(i=>i.AuthorNoRepeat.filter(j=>j.AuthorNoRepeat))
					//	resolve('nxtPg Ok.');
				}else{return console.log('curFavRowToSkipB4Qry='+this.favRowToSkipB4Qry+'  favTotalRec4CurAuthor='+this.favTotalRec4CurAuthor)}
				//});

				//--Get randomised Quote--
			}else JSObject1.chkBox1();

			//-----------end user want to view Favorite quote--------------		
		}
	},

	async	previousPg(){
		//-----If user want to view main quote i.e not Favorite view
		if (!this.favViewActive){	
			//---if not random quote view
			if(!Checkbox1.isChecked ){	
				if (this.rowToSkipB4Qry >0){
					return	this.rowToSkipB4Qry=this.rowToSkipB4Qry-1;
					//resolve('previousPg Ok');
				}else {return showAlert('You have reached the beginning record for this Author!')}


			}else JSObject1.chkBox1(); // get randomise quote
		}else{//-----------user want to view Favorite quote--------------	
			//---if not random quote view
			if(!Checkbox1.isChecked ){	
				if (this.favRowToSkipB4Qry >0){
					return	this.favRowToSkipB4Qry=this.favRowToSkipB4Qry-1;
					//resolve('previousPg Ok');
				}else{return console.log('curFavRowToSkipB4Qry='+this.favRowToSkipB4Qry+'  favTotalRec4CurAuthor='+this.favTotalRec4CurAuthor)}

			}else JSObject1.chkBox1(); // get randomise quote
		}

	},	

	randPg: async ()=>{
		if (!this.favViewActive){	
			// if totalRec4CurAuthor=5, it will return a number from 0 to 4
			this.rowToSkipB4Qry=await Math.floor(Math.random() * this.totalRec4CurAuthor);
		}else{
			//--user is viewing Favorite
			this.favRowToSkipB4Qry=await Math.floor(Math.random() * this.favTotalRec4CurAuthor);
		}	

	},

	async	chkBox1(){
		let myPromise = new Promise(function(resolve) {
			//-----If user want to view main quote i.e not Favorite view
			if (!this.favViewActive){	
				// if totalRec4CurAuthor=5, it will return a number from 0 to 4
				if (Checkbox1.isChecked){
					JSObject1.randPg();
					resolve('Random quote generated for current Author.');
				}
			}else{
				//---user viewing Favorite view
				if (Checkbox1.isChecked){
					JSObject1.randPg();
					resolve('Random quote generated for current Author in Favourite view.');
				}
			}
		});
		await myPromise;
	},
	//---called when a user click the Star button
	toggleFavView:()=>{
		//--if currently is in Favorite View
		if (this.favViewActive>0){
			this.favViewActive=0;
			Select_author.setOptions(this.nonFavSelOpt); 
			//ButtFaview_notice.setVisibility(false);
			//Img_FavOrNoFav.setVisibility(false);
			//Icon_heart.setVisibility(false);
			//	JSObject1.refreshTotalRec()
			//--set defualt selected label
			this.rowToSkipB4Qry=0;//Import!!! set this to 0 b4 calling query
      //--show grahic Quote (not Fav)  
			Img_FavOrNoFav.setImage('https://drive.google.com/thumbnail?id=1B949-AqBpIgnCHbcVi4cc_oa5LOHS_ww&sz=w66');
			Select_author.setSelectedOption("TF") 
				.then(()=> JSObject1.refreshTotalRec())
			// no need to call JSObject1.refreshTotalRec(), since we call assign 'TF' directly to totalRec4CurAuthor
			//this.totalRec4CurAuthor';

			//	JSObject1.refreshTotalRec()
			//.then(()=>JSObject1.shwQuoteOnTxtBox()	)		

		}else{ //--if currently is in NON Favorite view, change to Favorite View
			this.favViewActive=1;
			this.favRowToSkipB4Qry=0;//Import!!! set this to 0 b4 calling query
			//---re set up the Select_author dropdown widget
			JSObject1.getFavUniAthrThenMakeSelOpt();
			//ButtFaview_notice.setVisibility(true);		
			//Img_FavOrNoFav.setVisibility(true);
			 //--show grahic Quote ( Fav)  
			Img_FavOrNoFav.setImage('https://drive.google.com/thumbnail?id=1cY-ivcKCaa79lCmzc_BwbLTEkAwQe8OW&sz=w66');
			//Icon_heart.setVisibility(true);
		}
	},

	//---NOT use----
	// called when user clicked  (onClick event)the Save button after clicking the Add New icon. 
	// update query was call & fetch query was called. Google Sheet Updated but Tbl_fav Quotes & Authors column empty
	async saveAfrAddRow(){
		let myPromise = new Promise(function(resolve) {
			// populate Quote & Authors columns
			Tbl_fav.selectedRow.Quotes= Text1_quote.text;
			Tbl_fav.selectedRow.Authors= Select_author.selectedOptionValue;
			const myNewRowData = {
				Quotes: Mdl_Tbox_quote.text,
				Authors:Select_author.selectedOptionValue
			} 
			const updatedData = [...Tbl_fav.tableData, myNewRowData];
			Tbl_fav.setData(updatedData);
			resolve('Populated column Quotes & Authors.');

		});
		await myPromise;

	},

	//--This is being used
	//--Called when a user clicks Confirm butt in a Modal	
	addQuote2NewRow:() =>{
		//----This is how you get the last record row of a table.
		const lastRecNum=Tbl_fav.tableData.findLastIndex(a=>Number.isInteger(a.rowIndex));
		this.lastRecNo=lastRecNum+1;
		//showAlert('lastRecNo='+lastRecNo);
		//---NOT use
		const myNewRowData = {
			rowIndex: this.lastRecNo,
			UserName: Mdl_In_name.text,
			UserEmail: Mdl_In_email.text,
			Quotes: Mdl_Tbox_quote.text,
			Authors:Select_author.selectedOptionValue
		}
		const updatedData = [...Tbl_fav.tableData, myNewRowData];
		//	Tbl_fav.setData(updatedData)
		// .then(()=>Tbl_fav.setSelectedRowIndex(this.lastRecNo)) 

		closeModal(Mdl_add2Tbl_fav.name.toString())
		Container2.setVisibility(true)
			.then(()=>InsARow2GgleSht_qry.run())
			.then(()=>FavUseInTable_qry.run())
			.then(()=>JSObject1.chkHasUsrFav())

		//Tbl_fav.setTableData(updatedData);
		//Tbl_fav.s
	},	

	//--NOT use
	del_a_FavRow: () => {
		const updatedData = [...Tbl_fav.tableData];
		updatedData.splice(Tbl_fav.selectedRowIndex, 1);
		Tbl_fav.setData(updatedData);
	},	


	smple: async () =>{
		// const add_Q = await InsRow2_tbl_fav_qry.run();
		//	closeModal('Mdl_add2Tbl_fav');
		//	showAlert('Added current Quote to Favorite', 'success');
		//	FavShow_qry.run();
	},

}