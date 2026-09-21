<?php
define('ABSPATH','/'); const DAY_IN_SECONDS=86400;
$GLOBALS['IN_REST']=false; function wp_is_serving_rest_request(){return $GLOBALS['IN_REST'];}
$GLOBALS['H']=[]; $GLOBALS['T']=[]; $GLOBALS['META']=[]; $GLOBALS['MAILS']=[]; $GLOBALS['POSTS']=[]; $GLOBALS['CATS']=[];
function add_filter($h,$cb,$p=10,$n=1){$GLOBALS['H'][$h][]=[$p,$cb,$n];} function add_action($h,$cb,$p=10,$n=1){add_filter($h,$cb,$p,$n);}
function apply_filters_t($h,$val,...$args){ $l=$GLOBALS['H'][$h]??[]; usort($l,fn($a,$b)=>$a[0]<=>$b[0]); foreach($l as [$p,$cb,$n]) $val=$cb($val,...array_slice($args,0,$n-1)); return $val;}
function do_action_t($h,...$args){ $l=$GLOBALS['H'][$h]??[]; usort($l,fn($a,$b)=>$a[0]<=>$b[0]); foreach($l as [$p,$cb,$n]) $cb(...array_slice($args,0,$n)); }
function wp_parse_url($u,$c=-1){return parse_url($u,$c);} function home_url(){return 'https://fintech24h.com';}
function wp_strip_all_tags($s){return trim(preg_replace('/\s+/',' ',strip_tags(preg_replace('@<(script|style)[^>]*?>.*?</\\1>@si','',$s))));}
function get_transient($k){return $GLOBALS['T'][$k]??false;} function set_transient($k,$v,$e=0){$GLOBALS['T'][$k]=$v;return true;}
function update_post_meta($id,$k,$v){$GLOBALS['META'][$id][$k]=$v;} function error_log_t($m){}
function get_option($k){return 'admin@example.com';} function admin_url($p=''){return 'https://fintech24h.com/wp-admin/'.$p;}
function wp_mail($to,$s,$b){$GLOBALS['MAILS'][]=$s;return true;}
function get_post_status($id){return $GLOBALS['POSTS'][$id]['post_status']??false;}
function get_post($id){ return isset($GLOBALS['POSTS'][$id])?(object)$GLOBALS['POSTS'][$id]:null;}
function wp_get_post_categories($id){return $GLOBALS['CATS'][$id]??[];}
function wp_update_post($arr){ $id=$arr['ID']; $old=$GLOBALS['POSTS'][$id]['post_status']; $GLOBALS['POSTS'][$id]=array_merge($GLOBALS['POSTS'][$id],$arr); 
  $data=apply_filters_t('wp_insert_post_data',$GLOBALS['POSTS'][$id],$arr+['ID'=>$id],$arr); $GLOBALS['POSTS'][$id]=$data;
  if($old!==$data['post_status']) do_action_t('transition_post_status',$data['post_status'],$old,(object)$data); return $id;}
// Faithful simulation of WordPress's wp_insert_post + REST create/update ordering.
function sim_save(array $post,array $cats,bool $rest,int $id=0){
  static $next=1000; $isNew=($id===0); if($isNew){$id=++$next; $old='new'; $GLOBALS['POSTS'][$id]=['ID'=>$id,'post_type'=>'post','post_status'=>'auto-draft'];} else {$old=$GLOBALS['POSTS'][$id]['post_status'];}
  $GLOBALS['IN_REST']=$rest; $postarr=['ID'=>$isNew?0:$id]+$post; if(!$rest) $postarr['post_category']=$cats;   // classic: categories are in the array; REST: they are NOT
  $data=array_merge(['post_type'=>'post','post_author'=>1,'post_name'=>'','post_date_gmt'=>gmdate('Y-m-d H:i:s')],$post);
  $data=apply_filters_t('wp_insert_post_data',$data,$postarr,$postarr);
  $data['ID']=$id; $GLOBALS['POSTS'][$id]=array_merge($GLOBALS['POSTS'][$id],$data);
  if(!$rest) $GLOBALS['CATS'][$id]=$cats ?: [1];    // WordPress assigns default category when none given
  elseif($isNew) $GLOBALS['CATS'][$id]=[1];         // REST create: default cat until handle_terms runs
  $oldStatus=$isNew?'new':$old; if($oldStatus!==$data['post_status']) do_action_t('transition_post_status',$data['post_status'],$oldStatus,(object)$GLOBALS['POSTS'][$id]);
  do_action_t('wp_after_insert_post',$id);
  if($rest){ if($cats) $GLOBALS['CATS'][$id]=$cats; do_action_t('rest_after_insert_post',(object)$GLOBALS['POSTS'][$id]); }
  return $id;
}
