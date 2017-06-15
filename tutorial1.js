//To prevent a bug in IE where the global use of the 'viz' variable
//  interferes with the div id 'viz' (in the html), the following line is needed:
//  Note: this line does not appear in the tutorial videos but should still be used
//    and is in all of the included js files. 

var viz1, workbook, activeSheet
var index;


var a = ['A','A','B','B','C','C'];
var b= ['P','Q','R','P','Q','R'];
    
var c= [1,3,4,8,2,9];
var d= [1,3,4,8,2,9];



window.onload= function(){
     var placeholderDiv = document.getElementById("viz"); 
     var url = "https://public.tableau.com/views/JS_Bipartite/Sheet1?:embed=y&:display_count=yes"; 
     var options = {
        //height: placeholderDiv.offsetHeight,
          hideTabs: true,
          hideToolbar: true,
          onFirstInteractive: function () {
                workbook = viz1.getWorkbook();
                activeSheet = workbook.getActiveSheet();
				   listenToMarksSelection();
				
          }
     };
     viz1 = new tableauSoftware.Viz(placeholderDiv, url, options);    


};



function showOnly(filterName, values) {
	sheet = viz1.getWorkbook().getActiveSheet();
	if(sheet.getSheetType() === 'worksheet') {
		sheet.applyFilterAsync(filterName, values, 'REPLACE');
	} else {
		worksheetArray = sheet.getWorksheets();
		for(var i = 0; i < worksheetArray.length; i++) {
			worksheetArray[i].applyFilterAsync(filterName, values, 'REPLACE');
		}
	}
}

/* tableau to html */
var columnArray1= [];
var columnArray= [];
var columnArray2= [];

function listenToMarksSelection() {
            viz1.addEventListener(tableau.TableauEventName.MARKS_SELECTION, onMarksSelection);
			
        }

        function onMarksSelection(marksEvent) {
            return marksEvent.getMarksAsync().then(reportSelectedMarks);
        }

        function reportSelectedMarks(marks) {
            var html = ""; 
            
            for (var markIndex = 0; markIndex < marks.length; markIndex++) {
                var pairs = marks[markIndex].getPairs();
               // html += "<b>Mark " + markIndex + ":</b><ul>";

                for (var pairIndex = 0; pairIndex < pairs.length; pairIndex++) {
                    var pair = pairs[pairIndex];
			if (pairIndex==0)
			{
	
			columnArray.push(pair.formattedValue);

			}
			else if(pairIndex==1)
			{
			
			columnArray1.push(pair.formattedValue);
		
			}
				else if(pairIndex==2)
			{
			
			columnArray2.push(pair.formattedValue);
		
			}
					/* //var abc += pair.formattedValue + "," ;
                    html += "<li><b>Field Name:</b> " + pair.fieldName;
                    html += "<br/><b>Value:</b> " + pair.formattedValue + "</li>"; */
                }
			
                //html += "</ul>";
            }			 //d3.select("#bipartite_chart").selectAll("svg").remove();
						//d3.select("svg").remove();
						//var nodesArray = [];
						//$( "svg" ).empty();
						//alert(nodesArray);
						a = columnArray;
						b = columnArray1;
						c = columnArray2;
						d = columnArray2;
						
						
					d3chart();

		
            var infoDiv = document.getElementById('markDetails');
            infoDiv.innerHTML = html;

        }
		
d3chart();

function d3chart(){
//d3.selectAll("svg > *").remove();
//d3.select("*").remove();
d3.select("#bipartite_chart").select("svg").remove();
/* Code for creating json data */
var nodesArray = [];
 for (var i = 0; i < a.length; i++) { 

var a1 = a[i] ;
var b1 = b[i];
var c1 = c[i];
var d1 =  d[i];
 		nodesArray.push([a1,b1,c1,d1]);
	
    }

var _data=nodesArray;
console.log(_data);
//var body = d3.select("body");
//var svg = body.select("svg");
var svg = d3.select("#bipartite_chart").append("svg")
			.attr("width",  980)
			.attr("height", 500);
			
var color = {A:"#3366CC", B:"#DC3912",  C:"#FF9900"};
//var svg = d3.select("#bipartite_chart").append("svg").attr("width", 980).attr("height", 500);

var g1 = svg.append("g")
/*.on('click', function(d, i) {
var sel = d3.select(this);
console.log(sel)
})*/

.attr("transform","translate(90,50)");

var bp1=viz.bP()
			.data(_data)			
			.min(10)
			.pad(1)
			.height(400)
			.width(200)
			.barSize(35)
		.fill(function(d) {return color[d.primary] });
		
g1.call(bp1);



	g1.selectAll(".mainBars").append("text").attr("class","label")
		.attr("x",function(d){return (d.part=="primary"? -30: 30)})
		.attr("y",6)
		.text(function(d){return d.key})
		
		.attr("text-anchor",function(d){return (d.part=="primary"? "end": "start") });
		
			
	g1.selectAll(".mainBars").append("text").attr("class","perc")
		.attr("x",function(d){ return (d.part=="primary"? -70: 70)})
		.attr("y",6)
		.text(function(d){ return d3.format("0.0%")(d.percent)})
		.attr("text-anchor",function(d){ return (d.part=="primary"? "end": "start")});
		
g1.selectAll(".mainBars")
	.on("mouseover",mouseover)
	.on("mouseout",mouseout);


function mouseover(d){
	bp1.mouseover(d);

}	

function mouseout(d){
	bp1.mouseout(d);

}	

d3.selectAll("text,rect").on('click',
			   function(d){
			   //console.log(d.key)
			   var category_from_chart = d.key;
			   index = a.indexOf(category_from_chart);
				  
	var 	fieldname;		
    if (index == -1) {
        fieldname = "Column2";
    } else {
        fieldname = "Column1";
    }
			//   alert(category_from_chart);
			   showOnly(fieldname,category_from_chart)
			   })
			   

} 
