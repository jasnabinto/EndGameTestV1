var grid = document.getElementById("grid");
var myFullArr = [];
var x_name = [];

createTable();

function refreshGrid()
{
    var status = confirm("Are you sure you want refresh the grid ?");
    if(status == true)
    {
        createTable();
        alert("Grid refreshed!!!");
    }
}

function createTable() {
    grid.innerHTML = "";
    var table = document.createElement("TABLE");
    table.setAttribute("id", "myTable");
    grid.appendChild(table);

    var i;
    var j;

    //Adding rows of the table
    for (i = 0; i <= 100; i++) {
        var row = table.insertRow(Number(i));
        for (j = 0; j <= 100; j++) {
            var cell = row.insertCell(j);
            //Adding cell names
            if(i==0 && j>0)
            {
                n=j-1;
                var s="";
                while (n >= 0) {
                    s = String.fromCharCode(n % 26 + 65) + s;//26 is alphabets length and 65 is the A code
                    n = Math.floor(n / 26) - 1;
                }
                x_name[j-1] = s;
                cell.innerHTML = "<b>&nbsp;&nbsp;" + x_name[j-1] + "&nbsp;&nbsp;</b>";
            }
            //Adding rows number
            if (i>=1 && j==0) {
                cell.innerHTML = "<b>" + Number(i) + "</b>";
                cell.setAttribute("style", 'background-color:#F5F5F5;');
            } else {
                //Creating a new cell
                cell.setAttribute("id", x_name[j-1] + i);
                cell.setAttribute("onkeyup", "javascript:oninputchange(this,event)");
                cell.setAttribute("contenteditable", 'true');
                if (myFullArr.length > 0) {
                    var matchingCell = myFullArr.find(code => code.id == x_name[j-1] + i)
                    var className ="";
                    if (matchingCell !== undefined) {
                        if (matchingCell.ital == 1) {
                            className = className+" ital";
                        } if (matchingCell.bold == 1) {
                            className = className +" bold"
                        } if (matchingCell.unline == 1) {
                            className = className+" unline"
                        }
                        document.getElementById(x_name[j-1] + i).innerHTML = matchingCell.value;
                        cell.setAttribute("class", className);
                    }
                }
            }
        }
    }
}

// function calls on cell text change event
function oninputchange(element, event) {
    var changedCellText = element.innerHTML;
    var changedCellId = element.id;
    var changedCellHtml = document.getElementById(element.id).innerHTML;
    console.log(changedCellText)
    console.log(changedCellId)
    console.log(changedCellHtml)
    var status = false;
    if(changedCellText.toString().startsWith("=") == false)
    {
        status = true;
    }
    else
    {
       if( changedCellText.toString().includes("+") || changedCellText.toString().includes("-")
           || changedCellText.toString().includes("*") || changedCellText.toString().includes("/"))
       {status = true;}
       else    {status = false;}
    }
    if((changedCellText.toString().startsWith("=sum(") || changedCellText.toString().startsWith("=sub(")
        || changedCellText.toString().startsWith("=div(") || changedCellText.toString().startsWith("=mul("))
        && ( changedCellText.toString().includes(":") && changedCellText.toString().includes(")")))
    { status = true; }
    else if(status!=true)
    { status = false; }

    if(status == true)
    {
        //All cell entries updating to myFullArr array, if one cell entry all ready exits only its value will change to new value
        if ((myFullArr.some(code => code.id == changedCellId))) {
            var matchingCell = myFullArr.find(code => code.id == changedCellId)
            matchingCell.value = changedCellText;
        } else {
            myFullArr.push({
                id: changedCellId,
                value: changedCellText,
                html: changedCellHtml,
                ital: 0,
                bold: 0,
                unline: 0
            });
        }
        mainFunction(changedCellId, changedCellText);
    }
    else
    {
        return;
    }
}

//Function doing all the calculation
function mainFunction(changedCellId, changedCellText) {
    //checking the cell contains a formula or not
    var result = changedCellText.toString().startsWith("=");
    if (result) {
        if (changedCellText.includes('+')) { //Check for addition
            var arrStr = changedCellText.split('+'); //Splitting with + to get the LHS and RHS of the operand
            var LHSId = arrStr[0].toString().replace('=', '').trim();
            var RHSId = arrStr[1];
            var lastDigit = RHSId.toString().slice(-1);
            if(LHSId=="" || RHSId=="" || isNaN(lastDigit))
            {
                return;
            }
            var LHSvalue = document.getElementById(LHSId).innerHTML;
            var RHSvalue = document.getElementById(RHSId).innerHTML;
            var sum = parseInt(LHSvalue) + parseInt(RHSvalue);
            document.getElementById(changedCellId).innerHTML = sum;
            if ((myFullArr.some(code => code.id == changedCellId))) {
                var matchingCell = myFullArr.find(code => code.id == changedCellId)
                matchingCell.value = sum;
            }
        } else if (changedCellText.includes('*')) { //Check for Multiplication
            var arrStr = changedCellText.split('*'); //Splitting with * to get the LHS and RHS of the operand
            var LHSId = arrStr[0].toString().replace('=', '').trim();
            var RHSId = arrStr[1];
            var lastDigit = RHSId.toString().slice(-1);
            if(LHSId=="" || RHSId=="" || isNaN(lastDigit))
            {
                return;
            }
            var LHSvalue = document.getElementById(LHSId).innerHTML;
            var RHSvalue = document.getElementById(RHSId).innerHTML;
            var multiply = parseInt(LHSvalue) * parseInt(RHSvalue);
            document.getElementById(changedCellId).innerHTML = multiply;
            if ((myFullArr.some(code => code.id == changedCellId))) {
                var matchingCell = myFullArr.find(code => code.id == changedCellId)
                matchingCell.value = multiply;
            }
        } else if (changedCellText.includes('-')) { //Check for subtraction
            var arrStr = changedCellText.split('-'); //Splitting with - to get the LHS and RHS of the operand
            var LHSId = arrStr[0].toString().replace('=', '').trim();
            var RHSId = arrStr[1];
            var lastDigit = RHSId.toString().slice(-1);
            if(LHSId=="" || RHSId=="" || isNaN(lastDigit))
            {
                return;
            }
            var LHSvalue = document.getElementById(LHSId).innerHTML;
            var RHSvalue = document.getElementById(RHSId).innerHTML;
            var sub = parseInt(LHSvalue) - parseInt(RHSvalue);
            document.getElementById(changedCellId).innerHTML = sub;
            if ((myFullArr.some(code => code.id == changedCellId))) {
                var matchingCell = myFullArr.find(code => code.id == changedCellId)
                matchingCell.value = sub;
            }
        } else if (changedCellText.includes('/')) { //Check for division
            var arrStr = changedCellText.split('/'); //Splitting with / to get the LHS and RHS of the operand
            var LHSId = arrStr[0].toString().replace('=', '').trim();
            var RHSId = arrStr[1];
            var lastDigit = RHSId.toString().slice(-1);
            if(LHSId=="" || RHSId=="" || isNaN(lastDigit))
            {
                return;
            }
            var LHSvalue = document.getElementById(LHSId).innerHTML;
            var RHSvalue = document.getElementById(RHSId).innerHTML;
            var division = parseInt(LHSvalue) / parseInt(RHSvalue);
            document.getElementById(changedCellId).innerHTML = division;
            if ((myFullArr.some(code => code.id == changedCellId))) {
                var matchingCell = myFullArr.find(code => code.id == changedCellId)
                matchingCell.value = division;
            }
        } else if (changedCellText.includes(':')) { //Check for cell range operation
            var arrStr = changedCellText.split('('); //Splitting with ( to get the the operand as sum/sub/mul/div
            var operand = arrStr[0].toString().replace('=', '').trim();
            var LHSRHS = arrStr[1].split(':'); //Splitting with : to get the cell range
            var LHSId = LHSRHS[0].toString().trim();
            var RHSId = LHSRHS[1].toString().replace(')', '').trim();
            var finalresult = 0;
            var boolLHSId = "false";
            var boolRHSId = "false";
            for (i = 0; i < myFullArr.length; i++) { //for loop to look through array
                if (myFullArr[i].id == LHSId) {
                    boolLHSId = "true"; //making true if the first cell in the cell range reaches array
                }
                if (boolLHSId == "true" && boolRHSId == "false") // for each cells in the range untill it reaches the end of the cell range
                {
                    if (finalresult == "") {
                        finalresult = myFullArr[i].value;
                    } else {
                        if (operand == "sum") {
                            finalresult = parseInt(finalresult) + parseInt(myFullArr[i].value);
                        } else if (operand == "sub") {
                            finalresult = parseInt(finalresult) - parseInt(myFullArr[i].value);
                        } else if (operand == "mul") {
                            finalresult = parseInt(finalresult) * parseInt(myFullArr[i].value);
                        } else if (operand == "div") {
                            finalresult = parseInt(finalresult) / parseInt(myFullArr[i].value);
                        }
                    }
                }
                if (myFullArr[i].id == RHSId) {
                    boolRHSId = true; //making true when the last cell in the cell range reaches array to stop executing calculation
                }
            }
            document.getElementById(changedCellId).innerHTML = finalresult;
            if ((myFullArr.some(code => code.id == changedCellId))) {
                var matchingCell = myFullArr.find(code => code.id == changedCellId)
                matchingCell.value = finalresult;
            }
        }
    }
    if (myFullArr.some(code => code.html.toString().includes(changedCellId) )) {
        var matchingCell = myFullArr.filter(code => code.html.toString().includes(changedCellId));
        for(x of matchingCell)
        {
            mainFunction(x.id, x.html);
        }
    }
}

// Function to get the Selected Text
function getItalicsText() {
    var chldnodes = window.getSelection().anchorNode.parentElement.id;
    var matchingCell = myFullArr.find(code => code.id == chldnodes);
    if (matchingCell !== undefined) {
        if (matchingCell.ital == 1) {
            matchingCell.ital = 0;
            removeClass('ital',chldnodes)
        } else {
            matchingCell.ital = 1;
            addClass('ital',chldnodes);
        }
    }
}

function getULText(){
    var chldnodes = window.getSelection().anchorNode.parentElement.id;
    var matchingCell = myFullArr.find(code => code.id == chldnodes);
    if (matchingCell !== undefined) {
        if (matchingCell.unline == 1) {
            matchingCell.unline = 0;
            removeClass('unline',chldnodes)
        } else {
            matchingCell.unline = 1;
            addClass('unline',chldnodes);
        }
    }
}

// Function to get the Selected Text
function getBoldText() {
    var chldnodes = window.getSelection().anchorNode.parentElement.id;
    var matchingCell = myFullArr.find(code => code.id == chldnodes);
    if (matchingCell !== undefined) {
        if (matchingCell.bold == 1) {
            matchingCell.bold = 0;
            removeClass('bold',chldnodes)
        } else {
            matchingCell.bold = 1;
            addClass('bold',chldnodes);
        }
    }
}

function addClass(name,id) {
    var element, arr;
    element = document.getElementById(id);
    arr = element.className.split(" ");
    if (arr.indexOf(name) == -1) {
        element.className += " " + name;
    }
}

function removeClass(name,id) {
    var element = document.getElementById(id);
    if(name == 'bold')
    {
        element.className = element.className.replace(/\bbold\b/g, "");
    }
    else if(name == 'ital')
    {
        element.className = element.className.replace(/\bital\b/g, "");
    }
    else if(name == 'unline')
    {
        element.className = element.className.replace(/\bunline\b/g, "");
    }

}