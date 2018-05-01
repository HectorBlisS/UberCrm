var data = Papa.parse("lol,mijo");
var chunk = [];
var puerca = 0;
console.log("bliss")
var parse = new Vue({
	el: "#root",
	data: {
		title: "BlisS",
		data: data,
	},
	methods: {
		getFile: function(e){
			puerca = 0;
			e.preventDefault();
			var loading = this.$refs.loading;
			if (e.target[0].files.length < 1) return;
			loading.style.display = "block";
			var file = e.target[0].files[0];

			Papa.parse(file, {
					//header:true,
					//complete: function(results) {
					step: function(results){
						puerca++;
						//console.log("Finished:", results.data);
						//console.log(results.data);
						show(results.data);
					},
					complete: function(){
						loading.style.display = "none";
						console.log("asi te queria agarrar: ",puerca)
						submit();
					},
					error: function(err,file,input,reason){
						console.log(err);
						console.log(reason);
					}

			});

		},
        getTestFile: function(e){
            puerca = 0;
            e.preventDefault();
            var loading = this.$refs.loading;
            if (e.target[0].files.length < 1) return;
            loading.style.display = "block";
            var file = e.target[0].files[0];
            console.log('lolllll', file)

            Papa.parse(file, {
                //header:true,
                //complete: function(results) {
                step: function(results){
                    puerca++;
                    //console.log("Finished:", results.data);
                    //console.log(results.data);
                    showUpd(results.data);
                },
                complete: function(){
                    loading.style.display = "none";
                    console.log("asi te queria agarrar: ",puerca)
                    updateGrades();
                },
                error: function(err,file,input,reason){
                    console.log(err);
                    console.log(reason);
                }

            });

        },
        getUxFile: function(e){
            puerca = 0;
            e.preventDefault();
            var loading = this.$refs.loading;
            if (e.target[0].files.length < 1) return;
            loading.style.display = "block";
            var file = e.target[0].files[0];
            console.log('lolllll', file)

            Papa.parse(file, {
                //header:true,
                //complete: function(results) {
                step: function(results){
                    puerca++;
                    //console.log("Finished:", results.data);
                    //console.log(results.data);
                    showUxUpdate(results.data);
                },
                complete: function(){
                    loading.style.display = "none";
                    console.log("asi te queria agarrar: ",puerca)
                    updateGrades();
                },
                error: function(err,file,input,reason){
                    console.log(err);
                    console.log(reason);
                }

            });

        }

	}
});

function show(arr){
	const obj = {
		name:undefined,
		surName: undefined,
		lastName: undefined,
		email: undefined,
		tel: undefined,
		cp: undefined,
		kindOfUser: undefined,
		grade: undefined,
		adult: undefined,
		understanding: undefined,
		course: undefined,
		why: undefined,
		objectives: undefined,
		skills: undefined,
		date: undefined,
		token: undefined,
		score: undefined,
		evaluator: undefined,
		scoreN: undefined,
		comment: undefined,
	}

	const keys = Object.keys(obj);
	arr[0].forEach((field, i)=>{
		obj[keys[i]] = field;
	});
	//push al chunk
	chunk.push(obj);
	//subida
	// fetch('/add',{
	// 	method:"post",
	// 	headers:{"Content-Type":"application/json"},
	// 	body:JSON.stringify({chunk:chunk})
	// })
	// .then(res=>{
	// 	console.log(res.ok);
	// 	if(!res.ok) throw res.statusText;
	// })
}

function showUpd(arr){
	const obj={
		email:undefined,
		whyTo:undefined,
		webScore:undefined,
        technicalCategory:undefined
	}
    const keys = Object.keys(obj);
	let count = 0;

    arr[0].forEach((field, i)=>{
			if(i==3 || i==16 || i==17 ||i==18){
                obj[keys[count]] = field;
                count++
			}
	});
    //push al chunk
    chunk.push(obj);

}
function showUxUpdate(arr){
    const obj={
        email:undefined,
        whyTo:undefined,
        uxScore:undefined,
        technicalCategory:undefined
    }
    const keys = Object.keys(obj);
    let count = 0;

    arr[0].forEach((field, i)=>{
        if(i==3 || i==14 || i==15 ||i==19){
        obj[keys[count]] = field;
        count++
    }
});
    //push al chunk
    chunk.push(obj);

}

function submit(){
	console.log("chunk lee: ", chunk.length);
	fetch('/add',{
		method:"post",
		headers:{"Content-Type":"application/json"},
		body:JSON.stringify({chunk:chunk})
	})
	.then(res=>{
		console.log(res.ok);
		if(!res.ok) throw res.statusText;
		alert("ya");
	})
}

function updateGrades(){
    console.log("chunk lee: ", chunk.length);
    fetch('/update',{
        method:"post",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({chunk:chunk})
    })
        .then(res=>{
        console.log(res.ok);
    if(!res.ok) throw res.statusText;
    alert("updated");
})
}










