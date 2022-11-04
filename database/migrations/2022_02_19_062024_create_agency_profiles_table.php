<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAgencyProfilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('agency_profiles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('website')->nullable();
            $table->string('socialmedia')->nullable();
            $table->string('country_address');
            $table->string('rakhine_address');
            $table->string('funded_organizations');
            $table->string('phonenumber');
            $table->string('email');
            $table->binary('logo');
            $table->date('started_date');
            $table->boolean('allowtrip')->default(0);
            
            $table->bigInteger('user_id')->unsigned();
            $table
                ->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
            $table->bigInteger('agencytype_id')->unsigned();
            $table
                ->foreign('agencytype_id')
                ->references('id')
                ->on('agency_types')
                ->onDelete('cascade');

            $table->bigInteger('town_id')->unsigned();
            $table
                ->foreign('town_id')
                ->references('id')
                ->on('towns')
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
        Schema::dropIfExists('agency_profiles');
    }
}
