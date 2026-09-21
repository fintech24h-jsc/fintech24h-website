<?php
require '/w/stubs.php'; ini_set('log_errors','0');
require '/w/plugin.php';
$eng = 'The regulator said that the exchange is required to publish the audit for the users and the market with the highest standards of the industry. ';
$body = str_repeat($eng, 8);
$results=[]; $ok=true;
function check($name,$cond){ global $results,$ok; $results[]=($cond?'PASS ':'FAIL ').$name; if(!$cond)$ok=false; }
function status($id){return $GLOBALS['POSTS'][$id]['post_status'];}
function reset_state(){ $GLOBALS['T']=[]; $GLOBALS['MAILS']=[]; $GLOBALS['H']=$GLOBALS['H']; $GLOBALS['f24h_guard_pending']=[]; }

// 1 Studio: create draft with categories via REST, then POST status=publish (update)
$id=sim_save(['post_title'=>'Top 10 KYC providers','post_content'=>$body.'<a href="https://www.linkedin.com/x">x</a>','post_status'=>'draft'],[2],true);
check('Studio draft creation stays draft',status($id)==='draft');
$id2=sim_save(['post_title'=>'Top 10 KYC providers','post_content'=>$body.'<a href="https://www.linkedin.com/x">x</a>','post_status'=>'publish'],[],true,$id);
check('Studio draft->publish (cat 2 already set) STAYS PUBLISHED',status($id)==='publish');

// 2 Human, block editor: auto-draft -> single REST request with status=publish AND categories=[2] (terms saved after insert)
$id=sim_save(['post_title'=>'Hand written news','post_content'=>$body,'post_status'=>'publish'],[2],true);
check('Block editor publish with category in same request STAYS PUBLISHED',status($id)==='publish');

// 3 Human classic editor / quick publish with category
$id=sim_save(['post_title'=>'Classic post','post_content'=>$body,'post_status'=>'publish'],[3],false);
check('Classic editor publish with category STAYS PUBLISHED',status($id)==='publish');

// 4 Bot: REST create straight to publish, no category, one external link, English text (the 43 posts had casino words; test the pure category rule)
reset_state(); $id=sim_save(['post_title'=>'Neutral looking title','post_content'=>$body.'<a href="https://evil.example/">x</a>','post_status'=>'publish'],[],true);
check('Bot: REST publish in default category -> QUARANTINED',status($id)==='draft');
check('Bot: email sent',count($GLOBALS['MAILS'])>=1);

// 5 Bot: sets a REAL category but casino words + external link
reset_state(); $id=sim_save(['post_title'=>'Realz Casino Canada complete guide','post_content'=>$body.' casino <a href="https://realz-casino-canada.net/">x</a>','post_status'=>'publish'],[2],true);
check('Bot: casino words + ext link with real category -> QUARANTINED',status($id)==='draft');

// 6 Bot: foreign language + link, real category
reset_state(); $pl=str_repeat('Nowoczesne platformy oferują graczom wiele możliwości i bezpieczne metody płatności oraz szybkie wypłaty środków. ',8);
$id=sim_save(['post_title'=>'Bezpieczne platformy','post_content'=>$pl.'<a href="https://x.pl/">x</a>','post_status'=>'publish'],[2],true);
check('Bot: Polish text + ext link -> QUARANTINED',status($id)==='draft');

// 7 Bot: backdated (12 months) with real category, clean text, no link
reset_state(); $id=sim_save(['post_title'=>'Old dated','post_content'=>$body,'post_status'=>'publish','post_date_gmt'=>gmdate('Y-m-d H:i:s',time()-365*86400)],[2],true);
check('Bot: date 12 months back on NEW post -> QUARANTINED',status($id)==='draft');

// 8 Burst: 6 new posts straight to publish, real category, clean
reset_state(); $st=[]; for($i=0;$i<6;$i++){ $id=sim_save(['post_title'=>'Bulk '.$i,'post_content'=>$body,'post_status'=>'publish'],[2],true); $st[]=status($id);} 
check('Burst: first 4 pass, 5th and 6th quarantined',$st===['publish','publish','publish','publish','draft','draft']);

// 9 Already-published post edited with casino text stays untouched (Studio interlink pass)
reset_state(); $pid=sim_save(['post_title'=>'Legacy','post_content'=>$body,'post_status'=>'publish'],[2],true); 
sim_save(['post_title'=>'Legacy','post_content'=>$body.' casino <a href="https://x.com">x</a>','post_status'=>'publish'],[],true,$pid);
check('Published post updated later is NOT touched',status($pid)==='publish');

// 10 Draft in default category later published -> quarantined (documented behaviour)
reset_state(); $d=sim_save(['post_title'=>'Draft in cat1','post_content'=>$body,'post_status'=>'draft'],[1],true);
sim_save(['post_title'=>'Draft in cat1','post_content'=>$body,'post_status'=>'publish'],[],true,$d);
check('Draft left in default category, then published -> QUARANTINED',status($d)==='draft');

// 11 Non-post types & pages are ignored
reset_state(); $id=sim_save(['post_type'=>'page','post_title'=>'About','post_content'=>$body.' casino <a href="https://x.com">x</a>','post_status'=>'publish'],[],false);
check('Pages are ignored',status($id)==='publish');

echo implode("\n",$results),"\n", $ok?"ALL SCENARIOS PASS":"SOME FAILED","\n";
