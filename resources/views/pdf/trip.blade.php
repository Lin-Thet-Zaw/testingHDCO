<!DOCTYPE html>
<html lang="en">
<head>
   <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generate PDF</title>
    <style>
        @font-face {
        font-family: 'Zawgyi-One';
        src: url({{ storage_path('fonts\zawgyi-one.ttf') }}) format("truetype");
}
      }
        *{ font-family: "Zawgyi-One" !important;  word-wrap: break-word;}
        
        .text-center{
            text-align: center;
        }
        .infotable, .travellers{
            width: 100%;
            text-align: left;
        }
        .infotable tr{
            border: 1px solid gray;
        }
        .infotable td{
            width: 200px;
        }
        .infotable td{
        
            padding:10px;
        }

        .travellers td{
            padding: 10px;
        }
        td{
            text-align: left;
        }
    </style>
</head>
<body>
    <div class="text-center row">
       <img src="{{ $trip->profile->logo }}" alt="Ornanizagion Logo" width="150">
            <?php $timestamp=strtotime($trip->started_date); ?>
          <p style="text-align:right">A{{ str_pad($trip->id, 4, '0', STR_PAD_LEFT) }}{{ date('d', $timestamp) }}</p>

    </div>
    <h3 class="text-center">{{MyanFont::uni2zg($trip->profile->name)}}</h3>
    <table class="infotable">
        <tr>
            <td>ထြက္ခြာမည့္ရက္စြဲ</td>
            <td>{{ \Carbon\Carbon::parse($trip->started_date)->format('d-M-Y')}}</td>
        </tr>
        <tr>
            <td>ေရာက္ဟိမည့္ရက္စြဲ</td>
            <td>{{ \Carbon\Carbon::parse($trip->end_date)->format('d-M-Y')}}</td>
        </tr>
        <tr>
            <td>စထြက္မည့္နီရာ</td>
            <td>{{MyanFont::uni2zg($trip->departure_location)}}</td>
        </tr>
        <tr>
            <td>ဖုန္းနံပါတ္</td>
            <td>{{MyanFont::uni2zg($trip->phone_number)}}</td>
        </tr>
        <tr>
            <td>ခရီးလားမည့္နီရာ</td>
            <td>
                @foreach($trip->trip_addresses as $address)
                <p>{{MyanFont::uni2zg($address->location). ', '.MyanFont::uni2zg($address->village_track). ', '.MyanFont::uni2zg($address->town->name)}}</p>
                @endforeach
            </td>
        </tr>
        <tr>
            <td>ယာဥ္ေမာင္းနာမည္</td>
            <td>{{MyanFont::uni2zg($trip->driver)}}</td>
        </tr>
        <tr>
            <td>ယာဥ္အမ်ိဳးအစားႏွင့္အေရာင္</td>
            <td>{{MyanFont::uni2zg($trip->vehicle_type)}}</td>
        </tr>
        <tr>
            <td>ယာဥ္နံပါတ္</td>
            <td>{{MyanFont::uni2zg($trip->vehicle_number)}}</td>
        </tr>
        <tr>
            <td>ခရီးထြက္သည့္ရည္႐ြယ္ခ်က္</td>
            <td><p>{!! nl2br(e(MyanFont::uni2zg($trip->description))) !!}</p></td>
        </tr>
    </table>
    <hr />
  
    <table class="travellers">
        <tr>
            <td>#</td>
            <td>နာမည္</td>
            <td>ဓါတ္ပုံ</td>
            <td>လိင္</td>
            <td>လူမ်ိဳး</td>
        </tr>

        @foreach($trip->employees as $key=>$employee)
        <tr>
            <td>{{++$key}}</td>
            <td>{{MyanFont::uni2zg($employee->name)}}</td>
            <td><img src="{{ $employee->photo }}" alt="Passport" width="100"></td>
            <td>{{($employee->sex==1)?'Male':(($employee->sex==2)?'Other'  :'Female')}}</td>
            <td>{{MyanFont::uni2zg($employee->nationality->name)}}</td>
        </tr>
        <tr>
            <td></td>
            <td colspan="2">

              <img src="{{ $employee->id_front }}" alt="FrontId" width="250">

              
            </td>
            <td colspan="2">
                <img src="{{ $employee->id_back }}" alt="BackId" width="250">
            </td>
            
        </tr>   
        @endforeach
    </table>
</body>
</html>