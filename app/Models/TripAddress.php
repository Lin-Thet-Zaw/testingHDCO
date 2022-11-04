<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TripAddress extends Model
{
    use HasFactory;

    protected $fillable = ['location', 'village_track', 'town_id', 'travel_id'];

    public function town()
    {
        return $this->belongsTo(Town::class);
    }
}
