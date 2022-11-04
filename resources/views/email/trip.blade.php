@component('mail::message')

[logo]: {{asset('/logos/hdco.png')}} "Logo"

# Tharlizwabar 

Thanks for your cooperation. Please make sure that traveler brings attached travel note when they travel for the requested destination to conduct requested activities. Please show travel note when Arakan authorities ask for it. 
Have a safe trip.

သာလီစွပါ
အခုပိုင် ပူးပေါင်းဆောင်ရွက်မှုတွက် ကျေးဇူးတင်ပါရေ။ ခရီးလားရေ လူတိအနီနန့် တင်ပြထားရေအလုပ်တိကို လုပ်ဖို့အတွက် တောင်းခံထားရေ နီရာကို လားရေအခါ ပူးတွဲပါ ခရီးလားလာခြင်း မှတ်ချက်ကို ခရီးလားလာရေအခါ ယူဆောင်လားပီးပါ။ သက်ဆိုင်ရာ ရက္ခိုင့်အာဏာပိုင်တိက မိန်းမြန်းရေအခါ ယင်းခရီးလားမှတ်ချက်ကို ထုတ်ပြပီးပါ။ 
လုံခြုံရေ ခရီးဖြစ်ပါစီ။


{{-- @component('mail::button', ['url' => asset($filename)])
Download
@endcomponent --}}

ကျေးဇူးတင်ပါရေ,<br>
{{ config('app.name') }}
@endcomponent
