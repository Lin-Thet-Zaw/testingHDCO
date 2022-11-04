<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTripAddressesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('trip_addresses', function (Blueprint $table) {
            $table->id();
            $table->string('location');
            $table->string('village_track');
            $table->boolean('status')->default(1);
            $table->bigInteger('town_id')->unsigned();
            $table
                ->foreign('town_id')
                ->references('id')
                ->on('towns')
                ->onDelete('cascade');

            $table->bigInteger('travel_id')->unsigned();
            $table
                ->foreign('travel_id')
                ->references('id')
                ->on('travel')
                ->onDelete('cascade');
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
        Schema::dropIfExists('trip_addresses');
    }
}
