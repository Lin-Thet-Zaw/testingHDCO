<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\TripAddress;
use App\Models\Employee;

class Travel extends Model
{
    use HasFactory;

    public function employees()
    {
        return $this->belongsToMany(Employee::class, 'employee_travel');
    }

    public function profile()
    {
        return $this->belongsTo(AgencyProfile::class);
    }

    public function trip_addresses()
    {
        return $this->hasMany(TripAddress::class);
    }
}
