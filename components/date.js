//date input in UTC and output as eg. Sept 21, 2022

export function date(date, format){
    if(date){
      const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
      const d = new Date(date);
      const day = d.getDate();
      const month = d.getMonth();
      const year = d.getFullYear();
      //returns Sept 21, 2022
      if(format == "mmmddyy"){
        const monthInString = months[month];
        return monthInString+" "+day+", "+year;
      }
      //return 09-21-2022
      else if(format == "mmddyy"){
        return (month+1)+"-"+day+",-"+year;
      }
      //return 21-09-2022
      else if(format == "ddmmyy"){
        return day+"-"+(month+1)+"-"+year;
      }
      //return 21/09/2022
      else if(format == "dd/mm/yy"){
        return day+"/"+(month+1)+"/"+year;
      }
      else{
        return date;
      }
    }
    else{
      return null;
    }
  }
  