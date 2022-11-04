<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Town;
use App\Models\Community;
use App\Models\Location;
class Response extends Model
{
    use HasFactory;

    public function town(){
        return $this->belongsTo(Town::class);
    }

    public function community(){
        return $this->belongsTo(Community::class);
    }

    public function locationtype(){
        return $this->belongsTo(Location::class, 'location_id', 'id');
    }
}
