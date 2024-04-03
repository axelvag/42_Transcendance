from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone

class Game(models.Model):
  STATUS_CHOICES = [
    ('WAITING', 'Waiting'),
    ('READY', 'Ready'),
    ('RUNNING', 'Running'),
    ('FINISHED', 'Finished'),
    ('ABORTED', 'Aborted')
  ]

  player_left_id = models.CharField(max_length=255)
  player_left_score = models.IntegerField(default=0)
  player_left_connected = models.BooleanField(default=False)

  player_right_id = models.CharField(max_length=255)
  player_right_score = models.IntegerField(default=0)
  player_right_connected = models.BooleanField(default=False)
  
  status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='WAITING')
  winner_id = models.CharField(max_length=255, null=True, blank=True)
  won_by_forfeit = models.BooleanField(default=False)
  created_at = models.DateTimeField(auto_now_add=True)
  ended_at = models.DateTimeField(null=True, blank=True)
  
  def json(self):
    return {
      'id': self.id,
      'player_left_id': self.player_left_id,
      'player_left_score': self.player_left_score,
      'player_left_connected': self.player_left_connected,
      'player_right_id': self.player_right_id,
      'player_right_score': self.player_right_score,
      'player_right_connected': self.player_right_connected,
      'status': self.status,
      'winner_id': self.winner_id,
      'won_by_forfeit': self.won_by_forfeit,
      'created_at': self.created_at.strftime('%Y-%m-%dT%H:%M:%S'),
      'ended_at': self.ended_at.strftime('%Y-%m-%dT%H:%M:%S') if self.ended_at else None,
    }
  
  def clean(self):
    if self.player_left_id == self.player_right_id:
      raise ValidationError({'player_right_id': 'player_left_id and player_right_id cannot be the same'})

  def save(self, *args, **kwargs):
    self.full_clean()
    return super().save(*args, **kwargs)
  
  def join(self, player_id):
    self.refresh_from_db()
    if self.status != 'WAITING':
      return False
    if self.player_left_id == player_id:
      self.player_left_connected = True
    elif self.player_right_id == player_id:
      self.player_right_connected = True
    if self.player_left_connected and self.player_right_connected:
      self.status = 'READY'
    self.save()
    return True

  def leave(self, player_id):
    self.refresh_from_db()
    if self.player_left_id == player_id:
      self.player_left_connected = False
      opponent_id = self.player_right_id
    elif self.player_right_id == player_id:
      self.player_right_connected = False
      opponent_id = self.player_left_id
    if self.status != 'FINISHED':
      self.status = 'FINISHED'
      self.ended_at = timezone.now()
      self.winner_id = opponent_id
      self.won_by_forfeit = True
    self.save()

  def end(self, data):
    self.refresh_from_db()
    if self.status not in ['READY', 'RUNNING']:
      return False
    if data is None:
      return False
    winner_id = data.get('winner_id', None)
    if winner_id not in [self.player_left_id, self.player_right_id]:
      return False
    self.status = 'FINISHED'
    self.ended_at = timezone.now()
    self.winner_id = winner_id
    self.player_left_score = data.get('player_left_score', self.player_left_score)
    self.player_right_score = data.get('player_right_score', self.player_right_score)
    self.won_by_forfeit = data.get('won_by_forfeit', False)
    self.save()
    return True
