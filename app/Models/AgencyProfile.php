<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AgencyProfile extends Model
{
    use HasFactory;

    public function agencytype()
    {
        return $this->belongsTo(AgencyType::class);
    }

    public function town()
    {
        return $this->belongsTo(Town::class, 'town_id', 'id');
    }

    public function staffs()
    {
        return $this->hasMany(Staff::class, 'profile_id', 'id');
    }

    public function contacts()
    {
        return $this->hasMany(ContactPerson::class, 'profile_id');
    }

    public function budgets()
    {
        return $this->hasMany(Budget::class, 'profile_id');
    }

    public function donors()
    {
        return $this->hasMany(Donor::class, 'profile_id');
    }

    public function offices()
    {
        return $this->hasMany(Office::class, 'profile_id');
    }

    public function responses()
    {
        return $this->hasMany(Response::class, 'profile_id');
    }
}
