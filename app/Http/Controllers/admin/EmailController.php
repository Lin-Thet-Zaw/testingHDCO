<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\EmailList;

class EmailController extends Controller
{
    public function __construct()
    {
        $this->middleware(
            'permission:role-list|role-create|role-edit|role-delete|agency-list',
            ['only' => ['index', 'store']]
        );
        $this->middleware('permission:role-create', [
            'only' => ['create', 'store'],
        ]);
        $this->middleware('permission:role-edit', [
            'only' => ['edit', 'update'],
        ]);
        $this->middleware('permission:role-delete', ['only' => ['destroy']]);
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $users = EmailList::orderBy('id', 'DESC')->get();

        return response()->json($users);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'email'=>'required|email|unique:email_lists,email'
        ]);
        try {
            $mailable = new EmailList();
            $mailable->email = $request->email;
            $mailable->save();

            return response()->json($mailable);

        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'email'=>'required|email|unique:email_lists,email'
        ]);
        
        try {
            $mailable = EmailList::find($id);
            $mailable->email = $request->email;
            $mailable->save();
            return response()->json($mailable);

        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $mailable = EmailList::find($id);
        $mailable->delete();
        return response()->json($mailable);
    }
}
