<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <table>
        <thead>
            <tr>
                <th>စိုင်</th>
                <th>အဖွဲ့စည်းနာမည်</th>
                <th>ထွက်ခွာမည့်ရက်</th>
                <th>ရောက်ဟိမည့်ရက်</th>
                <th>နီရာ</th>
                <th>ကျေးရွာအုပ်စု</th>
                <th>မြို့နယ်</th>
                <th>လူအရီအတွက်</th>
                <th>ခရီးစထွက်မည့်နီရာ</th>
                <th>ဖုန်းနံပါတ်</th>
                <th>ယာဉ်မောင်း</th>
                <th>ယာဉ်နံပတ်</th>
                <th>ယာဉ်အမျိုးအစားနှင့်အရောင်</th>
                <th>ရက်စွဲ</th>
                <th>ခရီးသွားရသည့်ရည်ရွယ်ချက်</th>
            </tr>
        </thead>
        <tbody>
            @foreach($trips as $key=>$trip)
            <tr>
                <td>{{ ++$key }}</td>
                <td>{{ $trip->profile->name }}</td>
                <td>{{ $trip->started_date }}</td>
                <td>{{ $trip->end_date }}</td>
                @foreach($trip->trip_addresses as $key=>$address)
                <td>{{ $address->location }}</td>
                <td>{{ $address->village_track }}</td>
                <td>{{ $address->town->name }}</td>
                @endforeach
                <td>{{ $trip->employees->count() }}</td>
                <td>{{ $trip->departure_location }}</td>
                <td>{{ $trip->phone_number }}</td>
                <td>{{ $trip->driver }}</td>
                <td>{{ $trip->vehicle_number }}</td>
                <td>{{ $trip->vehicle_type }}</td>
                <td>{{ $trip->created_at }}</td>
                <td>{{ $trip->description }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>