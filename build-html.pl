#!/usr/bin/perl

use strict;
use warnings;

my $md5 = `md5 -q dist/index.js`;
chomp $md5;

open(my $src_landing_fh, '<', 'src/landing.html') or die $!;
my $html = do {local $/; <$src_landing_fh>}; # getto slurp
close $src_landing_fh;

$html =~ s{___CHECKSUM_HACK___}{$md5}g;

open(my $dist_landing_fh, '>', 'dist/landing.html') or die $!;
print $dist_landing_fh $html;
close $dist_landing_fh;
