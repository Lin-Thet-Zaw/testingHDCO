<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTravelTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('travel', function (Blueprint $table) {
            $table->id();
            $table->date('started_date');
            $table->date('end_date');
            $table->string('departure_location');
            $table->text('description');
            $table->string('phone_number');
            $table->string('driver');
            $table->string('vehicle_number')->nullable();
            $table->string('vehicle_type');
            $table->bigInteger('profile_id')->unsigned();
            $table
                ->foreign('profile_id')
                ->references('id')
                ->on('agency_profiles')
                ->onDelete('cascade');
            $table->tinyInteger('allow')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('travel');
    }
}
