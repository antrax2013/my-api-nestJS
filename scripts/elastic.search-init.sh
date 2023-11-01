sudo sysctl -w vm.max_map_count=262144

#docker exec -it elastic-service /usr/share/elasticsearch/bin/elasticsearch-setup-passwords auto
docker exec -it elastic-search /usr/share/elasticsearch/bin/elasticsearch-users useradd my-api-user -p 01GWP3VtYhH9FAZbv9fm -r superuser

# docker exec -it 75ec8e8938eb51166d1a60810c2ab7fa00226f02399dc8039049b3fa0bdfc39b  /bin/bash
# more /proc/sys/vm/max_map_count
